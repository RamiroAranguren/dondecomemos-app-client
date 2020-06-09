import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  errorDescriptions = {
    INCORRECT_OLD_PASSWORD: "La contraseña actual ingresada es incorrecta",
    INVALID_CREDENTIALS: "Usuario y/o contraseña inválidos",
    GUEST_USER: "Los invitados no pueden acceder a esta sección"
  }

  constructor(private toastService: ToastService) { }

  handleError(errorCode) {
    this.toastService.show(this.errorDescriptions[errorCode], 3000)
  }

}
