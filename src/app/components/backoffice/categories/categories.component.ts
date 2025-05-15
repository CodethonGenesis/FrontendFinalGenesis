import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/Event.service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export default class CategoriesComponent {
  // Para crear nueva categoría desde el modal
  newCategory = {
    name: '',
    descripcion: '',
    eventos: [], // Add empty eventos array to match Category interface
    seguidores: [], // Add empty seguidores array to match Category interface
  };

  editedCategory: Partial<Category> = {
    name: '',
    descripcion: '',
    eventos: [],
  };

  isEditing: boolean = false; // Variable para saber si se está editando una categoría
  idActual: number = -1; // Variable para guardar el id de la categoría que se está editando

  // Listado de todas las categorías para mostrar las categorías en la tabla
  categories: Category[] = [];

  // Constructor de la clase
  constructor(
    private categoryService: CategoryService,
    private eventService: EventService
  ) {}

  // Carga todas las categorías al iniciar el componente
  ngOnInit(): void {
    this.findCategories();
  }

  findCategories() {
    this.categoryService.findAll().subscribe({
      next: (data) =>
        (this.categories = data).forEach((category) => {
          category.eventos = []; // Inicializar la propiedad eventos como un array vacío
          console.log('Eventos de la categoría:', category.eventos);

          // Llamar al servicio de eventos para obtener los eventos de cada categoría
          this.eventService
            .findEventosByCategoria(category.id || -1)
            .subscribe({
              next: (eventos) => (category.eventos = eventos),
              error: (err) => console.error('Error al cargar eventos:', err),
            });
        }),
      error: (err) => console.error(err),
    });
  }

  // Método para crear una categoría
  createCategory() {
    if (!this.newCategory.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    this.categoryService.create(this.newCategory).subscribe({
      next: (category) => {
        console.log('Categoría creada:', category);
        this.newCategory = {
          name: '',
          descripcion: '',
          eventos: [],
          seguidores: [],
        };

        this.findCategories();
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        alert('Error al crear la categoría');
      },
    });
  }

  // Método para eliminar una categoría
  deleteCategory(id: number = 0) {
    if (id == undefined) {
      return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          console.log('Categoría eliminada');
          this.categories = this.categories.filter(
            (category) => category.id !== id
          );
        },
        error: (error: any) => {
          console.error('Error al eliminar categoría:', error);
          alert('Error al eliminar la categoría');
        },
      });
    }
  }

  // Métodos para editar / actualizar una categoría
  editCategory(id: number = 0) {
    const categoryToEdit = this.categories.find(
      (category) => category.id === id
    );
    if (categoryToEdit) {
      this.idActual = id; // Guardar el id de la categoría que se está editando
      this.editedCategory = { ...categoryToEdit };
      console.log('Id:', this.idActual);
      this.openModal(true);
    }
  }

  updateCategory() {
    if (!this.newCategory.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    this.categoryService.update(this.newCategory, this.idActual).subscribe({
      next: (category) => {
        console.log('Categoría actualizada:', category);
        this.closeModal();
        this.newCategory = {
          name: '',
          descripcion: '',
          eventos: [],
          seguidores: [],
        }; // Reiniciar el formulario
        this.findCategories();
      },
      error: (error) => {
        console.error('Error al actualizar categoría:', error);
        alert('Error al actualizar la categoría');
      },
    });
  }

  // -MÉTODOS PARA EL MODAL-

  // Método para abrir el modal
  openModal(editar = false) {
    this.newCategory = {
      name: '',
      descripcion: '',
      eventos: [],
      seguidores: [],
    }; // Reiniciar el formulario Reiniciar la categoría editada
    this.isEditing = editar; // Reiniciar el estado de edición al abrir el modal

    if (editar) {
      if (!this.editedCategory) {
        return;
      } else {
        this.newCategory.name = this.editedCategory.name || '';
        this.newCategory.descripcion = this.editedCategory.descripcion || '';
      }
    }

    (document.getElementById('my_modal_1') as HTMLDialogElement).showModal();
  }

  // Método para cerrar el modal
  closeModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement).close();
  }
}
