import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  constructor() { }

  examples: { direction: boolean, title: string, text: string, query: string, result: string, html: string }[] = [];

  ngOnInit(): void {
    this.examples = [
      { 
        direction: true,
        title: "Scrape Text from a page", 
        text: `
          To scrape text from a website, use a <span class="font-bold">TextQuery</span>. 
          It can be as simple or complex as the website you are scraping. 
          <div class="mt-4">
              <span class="underline">Nested Queries?</span> No problem, use nested <span class="font-bold">BaseQueries</span>.
          </div>
          <div class="">
              <span class="underline">Div's without class or id?</span> No problem, use nested <span class="font-bold">ChildQueries</span>.
          </div>
        `, 
        query: 'TextQuery <span class="text-slate-400 px-2">> </span> BaseQuery ( <span class="px-1 text-lime-600">".boy"</span> )', 
        result: '"Marcus"',
        html: `<div>
  <div class="girl">
    Anna
  </div>
  <div class="boy">
    Marcus
  </div>
  <div class="boy">
    Alexander
  </div>
</div>`
      },
      { 
        direction: false,
        title: "Scrape any Text from a page", 
        text: `
          To scrape any text, no matter if it's the first, second or hundreth element on a website, use a <span class="font-bold">TextQuery</span> and a <span class="font-bold">BaseQueryAll</span>. 
          It supplements the capabilities of the <span class="font-bold">BaseQuery</span>.
        `, 
        query: 'TextQuery <span class="text-slate-400 px-2">> </span> BaseQueryAll ( <span class="px-1 text-lime-600">".boy"</span> <span class="px-1 text-pink-600">1</span>)', 
        result: '"Alexander"',
        html: `<div>
  <div class="girl">
    Anna
  </div>
  <div class="boy">
    Marcus
  </div>
  <div class="boy">
    Alexander
  </div>
</div>`
      },
      { 
        direction: true,
        title: "Scrape a Table from a page", 
        text: `
          To scrape a Table, you have to specify a Query for the element equivalent of a row and the elements to select from inside that row element.
        `, 
        query: 'TableQuery <span class="text-slate-400 px-2"> > </span> Row: BaseQuery ( <span class="px-1 text-lime-600">".element"</span>) <span class="text-slate-400 px-2"> > </span> Column: BaseQuery ( <span class="px-1 text-lime-600">".name1"</span>)<span class="text-slate-400 px-2"> > </span> Column: BaseQuery ( <span class="px-1 text-lime-600">".name2"</span>) ', 
        result: '"Anna, Marcus" , "Alexander, Ferdinand"',
        html: `<div class="table">
    <div class="element">
        <p class="name1">
            Anna
        </p>
        <p>
            and
        </p>
        <p class="name2">
            Marcus
        </p>
    </div>
    <div class="element">
        <p class="name1">
            Alexander
        </p>
        <p>
            and
        </p>
        <p class="name2">
            Ferdinand
        </p>
    </div>
</div>`
      }
    ]
	}

}
