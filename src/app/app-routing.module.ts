import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'step-functions',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'step-functions',
    loadChildren: () => import('./pages/step-functions/step-functions.module').then( m => m.StepFunctionsPageModule)
  },
  {
    path: 'verify-number',
    loadChildren: () => import('./pages/verify-number/verify-number.module').then( m => m.VerifyNumberPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./pages/favorite/favorite.module').then( m => m.FavoritePageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'verify-number-code',
    loadChildren: () => import('./pages/verify-number-code/verify-number-code.module').then( m => m.VerifyNumberCodePageModule)
  },
  {
    path: 'recovery-password-email-step1',
    loadChildren: () => import('./pages/recovery-password-email-step1/recovery-password-email-step1.module').then( m => m.RecoveryPasswordEmailStep1PageModule)
  },
  {
    path: 'recovery-password-code-step2',
    loadChildren: () => import('./pages/recovery-password-code-step2/recovery-password-code-step2.module').then( m => m.RecoveryPasswordCodeStep2PageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'change-old-password',
    loadChildren: () => import('./pages/change-old-password/change-old-password.module').then( m => m.ChangeOldPasswordPageModule)
  },
  {
    path: 'restaurant/details',
    loadChildren: () => import('./pages/restaurants/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'credit-card-list',
    loadChildren: () => import('./pages/credit-card-list/credit-card-list.module').then( m => m.CreditCardListPageModule)
  },
  {
    path: 'credit-card-add',
    loadChildren: () => import('./pages/credit-card-add/credit-card-add.module').then( m => m.CreditCardAddPageModule)
  },
  {
    path: 'restaurant/info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'restaurant/qualify-review',
    loadChildren: () => import('./pages/qualify-review/qualify-review.module').then( m => m.QualifyReviewPageModule)
  },
  {
    path: 'restaurant/add-item-order',
    loadChildren: () => import('./pages/add-item-order/add-item-order.module').then( m => m.AddItemOrderPageModule)
  },
  {
    path: 'restaurant/book-table',
    loadChildren: () => import('./pages/book-table/book-table.module').then( m => m.BookTablePageModule)
  },
  {
    path: 'restaurant/view-list-orders',
    loadChildren: () => import('./pages/view-list-orders/view-list-orders.module').then( m => m.ViewListOrdersPageModule)
  },
  {
    path: 'order/rate',
    loadChildren: () => import('./pages/rate/rate/rate.module').then( m => m.RatePageModule)
  },
  {
    path: 'order/review',
    loadChildren: () => import('./pages/review/review/review.module').then( m => m.ReviewPageModule)
  },
  {
    path: 'order/view-order',
    loadChildren: () => import('./pages/view-order/view-order.module').then( m => m.ViewOrderPageModule)
  },
  {
    path: 'order/pre-order',
    loadChildren: () => import('./pages/pre-order/pre-order/pre-order.module').then( m => m.PreOrderPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
