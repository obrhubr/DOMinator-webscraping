import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyhtml',
  pure: true,
})
export class PrettyHTMLPipe implements PipeTransform {
  transform(value: any, args: any[]): any {
    try {
      /**
       * check and try to parse value if its a string or not
       */
      return this.applyColors(
        value,
        args[0],
        args[1]
      );
    } catch (e) {
      return this.applyColors({ error: 'Invalid HTML' }, args[0], args[1]);
    }
  }

  applyColors(obj: any, showNumberLine: boolean = false, padding: number = 4) {
    // line number start from 1
    let line = 1;

    /**
     * Converts special charaters like &, <, > to equivalent HTML code of it
     */
    obj = obj.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    /* taken from https://stackoverflow.com/a/7220510 */

    /**
     * wraps every datatype, key for e.g
     * numbers from json object to something like
     * <span class="number" > 234 </span>
     * this is why needed custom themeClass which we created in _global.css
     * @return final bunch of span tags after all conversion
     */
    obj = obj.replace(
      /div|p|".*"|(?<=&gt;\n)(.*)(?=\n.*&lt;)/g,
      (match: any) => {
        // class to be applied inside pre tag
        let themeClass = 'basic';
        let colormarkup = "text-slate-400";

        if (/div|p/.test(match)) {
          themeClass = 'tag';
          colormarkup = "text-blue-500"
        } else if (/".*"/.test(match)) {
          themeClass = 'class';
          colormarkup = "text-teal-600"
        } else if (/.*/.test(match)) {
          // Match between the tags
          themeClass = 'text';
          colormarkup = "text-black";
        }

        return '<span class="' + colormarkup + '">' + match + '</span>';
      }
    );

    /**
     * Regex for start of line, insert a number-line themeClass tag before each line
     */
    return showNumberLine
      ? obj.replace(
          /^/gm,
          () =>
            `<span class="number-line pl-3 select-none" >${String(line++).padEnd(padding)}</span>`
        )
      : obj;
  }
}

@NgModule({
  declarations: [PrettyHTMLPipe],
  exports: [PrettyHTMLPipe],
})
export class PrettyHTMLModule {}