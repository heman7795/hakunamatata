/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

 import Swal from 'sweetalert2';
export const environment = {
  production: true,
  baseUrl:'http://188.166.228.50:8080/election/admin/v1',
  // baseUrl: 'http://localhost:3019',

  //swal
  swalalert(type, msg) {
    if (type === 'success') {
      return new Promise(resolve => {
        Swal.fire({
          type: 'success',
          title: 'Success',
          text: msg,
          icon:'success',
          showConfirmButton: false,
          timer: 1500
        }).then(async (result) => {
          resolve(true);
        });
      });
    } else if (type === 'delete') {
      return new Promise(resolve => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, ' + msg + ' it!'
        }).then(async (result) => {
          if (result.value) {
            Swal.fire({
              title: msg + '!',
              text: 'Your file has been ' + msg + '.',
              type: 'success',
              showConfirmButton: false,
              timer: 1000
            }).then(async (result) => {
              resolve(true);
            })
          }
        })
      });
    } 
    else {
      Swal.fire({
        type: type,
        title: 'OOPS!',
        text: msg,
        icon:'warning',
        showConfirmButton: true,
      });
    }
  }
};
