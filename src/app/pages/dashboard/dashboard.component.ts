import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'datatables';
  pageNumber: any = 1;
  pages: any = 1;
  dtOptions: DataTables.Settings = {};
  posts;
  dtTrigger: Subject<any> = new Subject();
  registerForm: FormGroup;
  submitted = false;
  storeuser = []
  modeltype: boolean;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  @ViewChild('dynamicSeats') dynamicSeats: TemplateRef<any>;
  imageError: any;
  placeholder = "";
  cardImageBase64: any
  isImageSaved: boolean;
  viewList =[];
  constructor(private http: HttpClient, private modalService: NgbModal, private formBuilder: FormBuilder, private toaster: ToastrService) { }

  ngOnInit(): void {
  

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      
    };


    this.http.get('http://jsonplaceholder.typicode.com/posts')
      .subscribe(posts => {
        this.posts = posts;
        this.dtTrigger.next();
      });



    this.registerForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', [Validators.required]],
      logo: ['', Validators.required]
    });
    this.getUserlist()
    
  }


 

  getUserlist() {
    if(this.getStoreduser() != null){
      this.viewList = this.getStoreduser()
    }
   
  }

  getStoreduser() {
    return JSON.parse(localStorage.getItem('userList'))
  }

  adduser() {
    this.cardImageBase64 = ''
    this.onReset()
    this.modeltype = true
    this.modalService.open(this.dynamicSeats).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  get f() { return this.registerForm.controls; }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);


          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;

          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }


  editUser(id) {
    this.modeltype = false
    var storeduser = this.getStoreduser()
    var userbyId = storeduser.find((res) => id == res.id)
    this.registerForm.patchValue(userbyId)
    this.cardImageBase64 = userbyId.logo
    this.modalService.open(this.dynamicSeats).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  updateUser() {
    var Id = this.registerForm.value.id
    var userbyId = this.viewList.find((res) => Id == res.id)
    userbyId.firstName = this.registerForm.value.firstName
    userbyId.email = this.registerForm.value.email
    userbyId.logo = this.cardImageBase64
    userbyId.designation = this.registerForm.value.designation
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    localStorage.setItem('userList', JSON.stringify(this.viewList))
    this.modalService.dismissAll()
    this.dtTrigger.next();
    this.toaster.success('User Updated successfully')
  }

  deleteUser(Id) {

    this.viewList = this.viewList.filter(({ id }) => id !== Id)
    localStorage.setItem('userList', JSON.stringify(this.viewList))
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.getUserlist()
    this.dtTrigger.next();
    this.toaster.success('User Deleted successfully')
  }
  onSubmit() {
    var obj = {
      logo: this.cardImageBase64,
      id: uuidv4()
    }
    this.registerForm.patchValue(obj)
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.viewList.push(this.registerForm.value)
    localStorage.setItem('userList', JSON.stringify(this.viewList))

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.toaster.success('User added successfully')
    this.onReset()
    this.dtTrigger.next();
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.modalService.dismissAll()
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
