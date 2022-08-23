import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigFormComponent } from './pages/config/config.component';
import { ResultsComponent } from './pages/results/results.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ViewConfigComponent } from './pages/view-config/view-config.component';
import { ConfigItemComponent } from './pages/view-config/config-list/config-item/config-item.component';
import { ConfigListComponent } from './pages/view-config/config-list/config-list.component';
import { ScrapeListComponent } from './pages/results/scrape-list/scrape-list.component';
import { ScrapeItemComponent } from './pages/results/scrape-list/scrape-item/scrape-item.component';
import { QueryGenComponent } from './pages/config/query-gen/query-gen.component';
import { TextQueryComponent } from './pages/config/query-gen/text-query/text-query.component';
import { TableQueryComponent } from './pages/config/query-gen/table-query/table-query.component';
import { PrettyJsonModule } from './pipes/prettyprint.pipe';
import { PrettyHTMLModule } from './pipes/prettyprinthtml.pipe';
import { TableQueryResultComponent } from './pages/results/scrape-list/scrape-item/table-query-result/table-query-result.component';
import { TextQueryResultComponent } from './pages/results/scrape-list/scrape-item/text-query-result/text-query-result.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocsComponent } from './pages/docs/docs.component';
import { HomeComponent } from './pages/home/home.component';
import { PageComponent } from './pages/home/page/page.component';
import { ElementComponent } from './pages/home/page/element/element.component';
import { HomeNavbarComponent } from './pages/home/navbar/navbar.component';
import { FooterComponent } from './pages/home/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigFormComponent,
    ResultsComponent,
    NavbarComponent,
    ViewConfigComponent,
    ConfigItemComponent,
    ConfigListComponent,
    ScrapeListComponent,
    ScrapeItemComponent,
    QueryGenComponent,
    TextQueryComponent,
    TableQueryComponent,
    TableQueryResultComponent,
    TextQueryResultComponent,
    DocsComponent,
    HomeComponent,
    PageComponent,
    ElementComponent,
    HomeNavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrettyJsonModule,
    PrettyHTMLModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
