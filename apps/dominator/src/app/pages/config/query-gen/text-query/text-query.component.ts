import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BaseQuery, BaseQueryAll, ChildQuery, TextQuery, Query } from '@dominator/parser';

@Component({
  selector: 'app-text-query',
  templateUrl: './text-query.component.html',
  styleUrls: ['./text-query.component.scss']
})
export class TextQueryComponent implements OnInit {

  public textQueryFormGroup: FormGroup;
  public queryFormGroup: FormGroup;

  // This is set to true when the user has filled out the textQueryFormGroup
  nameFilled = false;
  // The state of the current query Entry (ex: state of The BaseQuery...)
  queryState: { id: string, selected: boolean, type: string, done: boolean } = { id: "0", selected: false, type: "", done: false }

  queries: { query: (BaseQuery | BaseQueryAll | ChildQuery), type: string, parent: string, id: string, dom: any }[] = [];

  @Input() dom: Document | null = null;
  currentDom: any;
  lastResult: string = "";
  lastDom: any;

  @Input() toolTipName: string = "Enter the name of the TextQuery here. The name will only be used to display it to you."
  @Input() toolTipNameObjName: string = "Enter the object name of the TextQuery here. This will be the name under which it is saved in the database."

  @Input() qName: string = ""
  @Input() qObjName: string = ""

  @Input() deletable: boolean = true;
  @Input() index: number | null = null;

  @Input() queryType: string = "TextQuery";

  @Input() query: TextQuery = { name: "", obj_name: "", query: { query: "" } as BaseQuery }
  @Output() sendTextQuery = new EventEmitter()
  @Output() sendSelectedDom = new EventEmitter()
  @Output() deleted = new EventEmitter()
  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {
    // The FormgGroup where the user enters the name and obj_name of the TextQuery
    this.textQueryFormGroup = this.formBuilder.group({
      name: new FormControl(this.query.name, [Validators.required]),
      obj_name: new FormControl(this.query.obj_name, [Validators.required])
    });

    // The  FormGroup where the user enters the QuerySelectors and childnums, etc..
    this.queryFormGroup = this.formBuilder.group({
      query: new FormControl("", []),
      num: new FormControl(null, [ Validators.pattern(/^[0-9]\d*$/) ]),
    });
  }

  ngOnInit(): void {
    this.currentDom = this.dom;
  }

  // This function is called when the user has entered the name and obj_name of the TextQuery
  onSubmit() {
    this.nameFilled = true;

    this.query.name = this.textQueryFormGroup.value.name;
    this.query.obj_name = this.textQueryFormGroup.value.obj_name;
  }

  // This function is called when the user presses on one of the "+ xxxxQuery" Buttons
  selectQuery(qt: string) {
    // Set selected to true to hide the + buttons
    this.queryState.selected = true;
    // Set the queryType to the selected type (ex: BaseQuery, ChildQuery...)
    this.queryState.type = qt;

    this.cdRef.detectChanges();
  }

  // This function is called when the > arrow is pressed -> the user wants to specify the next query
  querySubmit() {
    this.queryState.selected = false;

    let newId = crypto.randomUUID();

    if (this.queryState.type == 'BaseQuery') {
      this.queries.push({ 
        id: newId, 
        query: { query: this.queryFormGroup.value.query } as BaseQuery, 
        type: 'BaseQuery', 
        parent: this.queryState.id, 
        dom: this.currentDom 
      });
    }
    if (this.queryState.type == 'BaseQueryAll') {
      this.queries.push({ 
        id: newId, 
        query: { query: this.queryFormGroup.value.query, num: this.queryFormGroup.value.num } as BaseQueryAll, 
        type: 'BaseQueryAll', 
        parent: this.queryState.id, 
        dom: this.currentDom 
      });
    }
    if (this.queryState.type == 'ChildQuery') {
      this.queries.push({ 
        id: newId, 
        query: { query: this.queryFormGroup.value.query, childnum: this.queryFormGroup.value.num } as ChildQuery, 
        type: 'ChildQuery', 
        parent: this.queryState.id, 
        dom: this.currentDom 
      });
    }

    this.currentDom = this.getHTML();

    this.queryFormGroup.reset();
    this.queryState.id = newId;

    this.cdRef.detectChanges();
  }

  // This is a helper function to get the parentId from the index in the queries list
  getParent(parentID: string): { query: BaseQuery, type: string, parent: string, id: string } {
    return this.queries.filter(q => q.id == parentID)[0];
  }

  // This is the recursion helper for rebuildQuery
  rQ(q: { query: BaseQuery, type: string, parent: string, id: string }): { query: BaseQuery, type: string, parent: string, id: string } {
    // If the child is the top-element/has no parent, stop recursing
    if (q.parent == "0") {
      return q;
    }

    let parent = this.getParent(this.queries[this.queries.length - 1].parent);
    if (q.type == 'ChildQuery') {
      q.query.from = this.rQ(parent).query;
      q.query.query = undefined;
    } else {
      q.query.from = this.rQ(parent).query;
    }

    return q;
  }

  // This function rebuilds a valid query object from the list this.queries using the parentId recursively
  rebuildQuery() {
    let q = this.queries[this.queries.length - 1];

    let res = this.rQ(q);

    return res.query;
  }

  // This function is called when the user says he is done
  done() {
    this.queryState.done = true;
    this.querySubmit();

    // To reconstruct a valid query object from the list of queries with parents and childs, this function is called
    let q = this.rebuildQuery();
    this.query.query = q;

    this.sendTextQuery.emit(this.query);
    this.sendSelectedDom.emit(this.lastDom);
  }

  // The user can call this if he made a mistake. It should  either bring him back to the selectQuery screen or the enterQuery screen
  back() {
    if (this.queryState.selected) {
      // If the user already selected a query, go back to the selection screen and reset the form
      this.queryState.selected = !this.queryState.selected;
      this.queryFormGroup.reset();
    } else {
      // Then populate the form with the data from the last query in this.queries and remove it from this.queries
      // Then set the rest of the queryState properties to the correct values (id, type)
      let q = this.queries[this.queries.length - 1];
      this.queries.pop();

      let n = null;
      if (q.type === 'BaseQueryAll') {
        n = (q.query as BaseQueryAll).num;
        this.queryState.type = 'BaseQueryAll';
      }
      if (q.type === 'ChildQuery') {
        n = (q.query as ChildQuery).childnum;
        this.queryState.type = 'ChildQuery';
      }
      if (q.type == 'BaseQuery') {
        this.queryState.type = 'BaseQuery';
      }

      this.queryState.id = q.parent;

      this.queryFormGroup.setValue({
        query: q.query.query,
        num: n
      });

      this.currentDom = q.dom;

      this.queryState.selected = !this.queryState.selected;
    }

    this.cdRef.detectChanges();
  };

  delete() {
    this.deleted.emit(this.index);
  }
  
  // Dom Autocomplete

  getHTML() {
    let sQ = this.queryFormGroup.value.query;
    let nQ = this.queryFormGroup.value.num as number;

    if (sQ != "" && sQ != "#" && sQ != "." && sQ != null) {
      if (nQ != null) {
        let res = this.currentDom?.querySelectorAll(this.queryFormGroup.value.query)[nQ];

        if (res) {
          return res;
        }
      } else {
        let res = this.currentDom?.querySelector(this.queryFormGroup.value.query);

        if (res) {
          return res;
        }
      }
    } else {
      if (nQ != null) {
        let res = this.currentDom?.children[nQ];

        if (res) {
          return res;
        }
      }
    }
  }

  getElement() {
    let res = this.getHTML();
    if (res) {
      this.lastResult = res.textContent;
      this.lastDom = res;
      return res.textContent;
    }

    return "No matching element found...";
  }

  getQueryStack(): string {
    let result = this.queryType + " > ";
    for (let i = 0; i < this.queries.length; i++) {
      result += this.queries[i].type;
      if (this.queries[i].type == "BaseQuery") {
        result += "(<span class='px-1 text-lime-600'>" + this.queries[i].query.query + "</span>)";
      }
      if (this.queries[i].type == "BaseQueryAll") {
        result += "(<span class='px-1 text-lime-600'>" + this.queries[i].query.query + "</span> <span class='px-1 text-pink-600'>" + (this.queries[i].query as BaseQueryAll).num + "</span>)";
      }
      if (this.queries[i].type == "ChilQuery") {
        result += "(<span class='px-1 text-pink-600'>" + (this.queries[i].query as ChildQuery).childnum + "</span>)";
      }
      result += " > ";
    }

    return result;
  }
}