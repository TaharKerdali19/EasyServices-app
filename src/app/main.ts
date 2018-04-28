import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
