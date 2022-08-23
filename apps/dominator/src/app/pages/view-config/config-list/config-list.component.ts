import { Component, OnInit } from '@angular/core';

import { QueryConfigResponse } from '@dominator/parser';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent implements OnInit {

  constructor(private readonly configService: ConfigService) { }

  configs: QueryConfigResponse[] = [];

  ngOnInit(): void {
    this.configService.getConfigs().subscribe(data => this.configs = data);
  }

}
