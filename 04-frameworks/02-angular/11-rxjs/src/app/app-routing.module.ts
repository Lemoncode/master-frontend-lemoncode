import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObservablesComponent } from './components/pages/observables/observables.component';
import { SearchComponent } from './components/pages/search/search.component';
import { CatalogComponent } from './components/pages/catalog/catalog.component';


const routes: Routes = [
  { path: '', redirectTo: 'observables', pathMatch: 'full' },
  { path: 'observables', component: ObservablesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'catalog', component: CatalogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
