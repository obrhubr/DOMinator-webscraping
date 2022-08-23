import { HomeComponent } from './pages/home/home.component';
import { DocsComponent } from './pages/docs/docs.component';
import { ViewConfigComponent } from './pages/view-config/view-config.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigFormComponent } from './pages/config/config.component';
import { ResultsComponent } from './pages/results/results.component';

const routes: Routes = [
  { 
    path: '',
    component: HomeComponent 
  },
  { 
    path: 'docs',
    component: DocsComponent 
  },
  { 
    path: 'results',
    component: ResultsComponent 
  },
  { 
    path: 'config/add',
    component: ConfigFormComponent 
  },
  { 
    path: 'configs',
    component: ViewConfigComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
