import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent implements OnInit {

  constructor() { }

  @Input() example: { direction: boolean, title: string, text: string, query: string, result: string, html: string } = { direction: true, title: "", text: "", query: "", result: "", html: "" };

  ngOnInit(): void {
  }

  getDataReplace() {
    if (this.example.direction) {
      return '{ "translate-x-12": "translate-y-0", "opacity-0": "opacity-100" }';
    } else {
      return '{ "-translate-x-12": "translate-y-0", "opacity-0": "opacity-100" }';
    }
  }

}
