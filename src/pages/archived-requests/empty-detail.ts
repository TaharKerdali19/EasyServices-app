import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'empty-detail',
  templateUrl: 'empty-detail.html'
})

export class EmptyDetailPage {
  data: string;

  constructor(private navParams: NavParams) { }

  ngOnInit(): void {
    this.data = this.navParams.data['title'];
  }
}