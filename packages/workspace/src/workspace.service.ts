import { Inject, Injectable, Optional } from '@nestjs/common';
import { WORKSPACE_CONFIG } from './workspace.constants';

@Injectable()
export class WorkspaceService {
  // constructor(@Inject(WORKSPACE_CONFIG) private readonly wc: any) {
  //   console.log(wc)
  // }

  // constructor(@Inject(WORKSPACE_CONFIG) private readonly wc: Record<any, a) {
  //   console.log(111)
  // }

  test() {
    console.log(3);
  }
}
