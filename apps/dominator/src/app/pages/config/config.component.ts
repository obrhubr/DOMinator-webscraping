import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { QueryConfig, TableQuery, TextQuery } from '@dominator/parser';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigFormComponent {

  model: QueryConfig = new QueryConfig('', '', '* * * * *', 
    {
      "queries": []
    }
  );

  configDone = false;
  submitted = false;

  // Preview
  dom: string = "";
  image: string = "";
  fetchedUrl: string = "";

  public configForm: FormGroup;

  constructor(private readonly configService: ConfigService, private formBuilder: FormBuilder, private router: Router) {
    this.configForm = formBuilder.group({
      url: new FormControl(this.model.url, [
        Validators.required,
        Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/)
      ]),
      name: new FormControl(this.model.name, [
        Validators.required,
        Validators.minLength(1)
      ]),
      cron: new FormControl(this.model.cron, [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(14),
        Validators.pattern(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/)
      ]),
    });
  }

  get m() {
    return this.configForm.controls;
  }

  ngOnInit(): void {
    
  }

  addQuery(q: (TextQuery | TableQuery)[]) {
    this.model.config.queries = q;
    this.configDone = true;
  }

  getPreview() {
    let url = this.configForm.value.url;
    this.fetchedUrl = url;
    if (url) {
      this.configService.getPreview(url).subscribe((data: any) => {
        this.dom = data.dom;
        this.image = data.image;
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    this.configService.createConfig({ ...this.configForm.value, config: this.model.config}).subscribe((data: object) => { console.log(data) });

    this.router.navigate(['/configs']);
  }

}
