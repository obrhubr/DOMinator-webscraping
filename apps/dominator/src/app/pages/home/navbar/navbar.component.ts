import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class HomeNavbarComponent implements OnInit {

  	constructor() { }

	ngOnInit(): void {
		document.addEventListener("DOMContentLoaded", function(){
			var replacers = document.querySelectorAll('[data-replace]');
			for(var i=0; i<replacers.length; i++){
				let replaceClasses = JSON.parse((replacers[i] as any).dataset.replace.replace(/'/g, '"'));
				Object.keys(replaceClasses).forEach(function(key) {
					replacers[i].classList.remove(key);
					replacers[i].classList.add(replaceClasses[key]);
				});
			}
		});
	}

}
