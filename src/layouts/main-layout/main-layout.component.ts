import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  template: `
    <app-header></app-header>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <a
      class="floating-whatsapp"
      href="https://wa.me/51999999999"
      target="_blank"
      rel="noopener"
      aria-label="Contactar por WhatsApp">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .content {
      min-height: calc(100vh - 78px);
    }

    .floating-whatsapp {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 1200;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 58px;
      height: 58px;
      border: 3px solid #fff;
      border-radius: 50%;
      background: #25d366;
      color: #fff;
      font-size: 2rem;
      text-decoration: none;
      box-shadow: 0 12px 28px rgb(17 24 39 / 28%);
      transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    }

    .floating-whatsapp:hover {
      background: #1fb85a;
      color: #fff;
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 16px 32px rgb(17 24 39 / 32%);
    }

    .floating-whatsapp i {
      line-height: 1;
    }

    @media (max-width: 640px) {
      .floating-whatsapp {
        right: 16px;
        bottom: 16px;
        width: 52px;
        height: 52px;
        font-size: 1.75rem;
      }
    }
  `
  ]
})
export class MainLayoutComponent {}
