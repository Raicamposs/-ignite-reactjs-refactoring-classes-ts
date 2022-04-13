import { useEffect, useState } from 'react';
import { Food } from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { Foods } from '../../models/foods';
import api from '../../services/api';
import { FoodsContainer } from './styles';


type State = {
  foods: Foods[];
  editingFood: Foods | undefined;
  modalOpen: boolean;
  editModalOpen: boolean;
}

export default function Dashboard() {

  const defaultState = {
    foods: [],
    editingFood: undefined,
    modalOpen: false,
    editModalOpen: false,
  }

  const [{ modalOpen, editModalOpen, editingFood, foods }, setState] = useState<State>(defaultState)

  useEffect(() => {
    const search = async () => {
      const response = await api.get<Foods[]>('/foods');
      setState((state) => ({
        ...state, foods: response.data
      }));
    }

    search()
  }, [])

  const handleAddFood = async (food: Foods) => {
    try {
      const response = await api.post<Foods>('/foods', {
        ...food,
        available: true,
      });

      setState((state) => ({ ...state, foods: [...state.foods, response.data] }));
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Foods) => {

    if (!editingFood) {
      return;
    }

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState({ ...defaultState, foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setState({ ...defaultState, foods: foodsFiltered });
  }

  const toggleModal = () => {
    setState((state) => ({ ...state, modalOpen: !state.modalOpen }));
  }

  const toggleEditModal = () => {
    setState((state) => ({ ...state, editModalOpen: !state.editModalOpen }));
  }

  const handleEditFood = (food: Foods) => {
    setState((state) => ({ ...state, editingFood: food, editModalOpen: true }));
  }



  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

};

