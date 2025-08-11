import { Controller } from '@nestjs/common';
import { AgreementService } from './agreement.service';

@Controller('agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}
}
