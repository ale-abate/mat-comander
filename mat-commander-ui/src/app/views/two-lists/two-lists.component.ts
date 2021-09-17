import {Component, OnInit} from '@angular/core';
import {CommandCenterService} from '../../services/command-center.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-two-lists',
  templateUrl: './two-lists.component.html',
  styleUrls: ['./two-lists.component.scss']
})
export class TwoListsComponent implements OnInit {



  constructor(private route: ActivatedRoute,
    public ccs: CommandCenterService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data =>
          console.log('two-list ready', data.appStatus)

    )
  }

}
