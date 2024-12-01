import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalElement: any;

  // Set the modal element (optional, if using manual reference)
  setModalElement(elementId: string) {
    this.modalElement = document.getElementById(elementId);
  }
  openModal() {
    var bootstrap: any;
    if (this.modalElement) {
      const modal = new bootstrap.Modal(this.modalElement);
      modal.show();
    }
  }

  closeModal() {
    var bootstrap: any;
    if (this.modalElement) {
      const modal = bootstrap.Modal.getInstance(this.modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
