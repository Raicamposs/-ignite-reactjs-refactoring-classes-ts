import { createRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { Foods } from '../../models/foods';
import Input from '../Input';
import Modal from '../Modal';
import { Form } from './styles';

type ModalEditFoodParams = {
  isOpen: boolean
  handleUpdateFood: (value: Foods) => void
  setIsOpen: () => void
  editingFood?: Foods
}



function ModalEditFood(props: ModalEditFoodParams) {
  const formRef = createRef<any>();
  const { isOpen, setIsOpen, editingFood } = props;

  const handleSubmit = async (data: any) => {
    const { setIsOpen, handleUpdateFood } = props;

    handleUpdateFood(data);
    setIsOpen();
  };




  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );

};

export default ModalEditFood;
