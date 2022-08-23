import { ConfigService } from '../../../../services/config.service';
import { QueryConfigResponse } from '@dominator/parser';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-item',
  templateUrl: './config-item.component.html',
  styleUrls: ['./config-item.component.scss']
})
export class ConfigItemComponent implements OnInit {

  @Input() config: QueryConfigResponse = new QueryConfigResponse('', '', '', '', { queries: [] })
  constructor(private readonly configService: ConfigService, private router: Router) { }

  collapsed = true;

  ngOnInit(): void {
  }

  deleteConfig(id: string) {
    this.configService.deleteConfig(id);

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/configs'])
    );
  }

  scrape(id: string) {
    this.configService.scrape(id);

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/results'])
    );
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }

  getConfig() {
    if (this.collapsed) {
      return { queries: ["..."] };
    } else {
      return this.config.config;
    }
  }

}
