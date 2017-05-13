import { Component,ViewChild,ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
    selector: 'my-app',
    template: `<nav class="navbar navbar-default">
                    <div class="container-fluid">
                        <div class="navbar-header">
                        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul class="nav navbar-nav">
                            <li><a>File Upload</a></li>
                            </ul>
                        </div>
                        </div>
                    </div>
                </nav>
                <div class="container">
                    <div class="row">
                        <div class="col-md-4">
                            <form>
                                <div class="form-group">
                                    <label for="multiple">Multiple</label>
                                    <input type="file" class="form-control" name="multiple" ng2FileSelect [uploader]="uploader" multiple  />
                                </div>
                                <div class="form-group">
                                    <label for="single">single</label>
                                    <input #uploadEl type="file" class="form-control"   name="single" ng2FileSelect [uploader]="uploader" [disabled]="uploader?.queue?.length != 0"/>                                  
                                </div>            
                            </form>
                        </div>
                        <div class="col-md-8">
                            <h3>File Upload with Angular 2 and Node</h3>
                            Queue length: {{ uploader?.queue?.length }}

                            <table class="table">
                                <thead>
                                <tr>
                                    <th width="50%">Name</th>
                                    <th>Size</th>
                                    <th>Progress</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr *ngFor="let item of uploader.queue">
                                    <td><strong>{{ item.file.name }}</strong></td>
                                    <td nowrap>{{ item.file.size/1024/1024 | number:'.2' }} MB</td>
                                    <td>
                                        <div class="progress" style="margin-bottom: 0;">
                                            <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <span *ngIf="item.isSuccess"><i class="glyphicon glyphicon-ok"></i></span>
                                        <span *ngIf="item.isCancel"><i class="glyphicon glyphicon-ban-circle"></i></span>
                                        <span *ngIf="item.isError"><i class="glyphicon glyphicon-remove"></i></span>
                                    </td>
                                    <td nowrap>
                                        <button type="button" class="btn btn-success btn-xs"
                                                (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">
                                            <span class="glyphicon glyphicon-upload"></span> Upload
                                        </button>
                                        <button type="button" class="btn btn-warning btn-xs"
                                                (click)="item.cancel()" [disabled]="!item.isUploading">
                                            <span class="glyphicon glyphicon-ban-circle"></span> Cancel
                                        </button>
                                        <button type="button" class="btn btn-danger btn-xs"
                                                (click)="onItemRemove(item)">
                                            <span class="glyphicon glyphicon-trash"></span> Remove
                                        </button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <div>
                                <div>
                                    Queue progress:
                                    <div class="progress" style="">
                                        <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-success btn-s"
                                        (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
                                    <span class="glyphicon glyphicon-upload"></span> Upload all
                                </button>
                                <button type="button" class="btn btn-warning btn-s"
                                        (click)="uploader.cancelAll()" [disabled]="!uploader.isUploading">
                                    <span class="glyphicon glyphicon-ban-circle"></span> Cancel all
                                </button>
                                <button type="button" class="btn btn-danger btn-s"
                                        (click)="uploader.clearQueue()" [disabled]="!uploader.queue.length">
                                    <span class="glyphicon glyphicon-trash"></span> Remove all
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`
})
export class AppComponent {
    @ViewChild('uploadEl') uploadElRef: ElementRef
    authHeader: Array<Headers> = [];
    fileValue:any;
    public uploader: FileUploader = new FileUploader({
        //give api url
        url: 'http://localhost:3001/uploads',
        //add header here
        headers: [{ name: 'email', value: 'billavaa@gmail.com' }],
        // mime type
        allowedMimeType: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.ms-excel'

        ],
        //file size limit : 5mb
        maxFileSize: 5 * 1024 * 1024
    }
    );
    ngOnInit() {
        //if you want to add additional param before upload
        this.uploader.onBeforeUploadItem = (item: any) => {

            this.uploader.options.additionalParameter = {
                name: item.file.name
            };
        };
    }

    onItemRemove(item:any){
        //remove item and clear input
        item.remove();
         this.uploadElRef.nativeElement.value = ''
        this.uploader.clearQueue();
    }
} 