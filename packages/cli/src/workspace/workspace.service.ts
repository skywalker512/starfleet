import { Injectable, Inject } from '@nestjs/common';
import { A } from './a';
import { WORKSPACE_CONFIG } from './workspace.constants';

@Injectable()
export class WorkspaceService {
  // constructor(@Inject(WORKSPACE_CONFIG) private readonly wc: any) {
  //   // console.log(wc)
  // }
  //
  constructor(public a: A) {
    console.log(a)
  }

  // constructor(@Inject(WORKSPACE_CONFIG) private readonly wc: Record<any, a) {
  //   console.log(111)
  // }

  test() {
    console.log(1);
  }
}
