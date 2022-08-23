import { ConfigService } from '../../services/config.service';
import { QueryConfigResponse } from '@dominator/parser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  constructor(private readonly configService: ConfigService) { }

  configs: QueryConfigResponse[] = []

  ngOnInit(): void {
    this.configService.getConfigs().subscribe(data => this.configs = data);
  }

}
