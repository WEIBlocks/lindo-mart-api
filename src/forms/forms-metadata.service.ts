import { Injectable, BadRequestException } from '@nestjs/common';
import { UnitOfMeasureService } from '../itemlist/inventory/common/unitOfMeasure/unit-of-measure.service';
import { PackagingService } from '../itemlist/inventory/common/packaging/packaging.service';
import { ReasonCodeService } from '../itemlist/equipment/common/reasonCode/reason-code.service';
import { ActionsService } from '../itemlist/common/actions/actions.service';

@Injectable()
export class FormsMetadataService {
  constructor(
    private readonly unitOfMeasureService: UnitOfMeasureService,
    private readonly packagingService: PackagingService,
    private readonly reasonCodeService: ReasonCodeService,
    private readonly actionsService: ActionsService,
  ) {}

  async getFormMetadata(itemListType: string) {
    if (!itemListType) {
      throw new BadRequestException('itemListType query parameter is required');
    }

    const metadata: any = {};

    switch (itemListType) {
      case 'inventory':
        // Inventory: unitOfMeasure, packaging, actions
        const [unitOfMeasure, packaging, inventoryActions] = await Promise.all([
          this.unitOfMeasureService.getPublicUnitsOfMeasure(),
          this.packagingService.getPublicPackaging(),
          this.actionsService.getPublicActions('inventory'),
        ]);
        metadata.unitOfMeasure = unitOfMeasure;
        metadata.packaging = packaging;
        metadata.actions = inventoryActions;
        break;

      case 'equipment':
        // Equipment: actions, reasonCodes
        const [equipmentActions, reasonCodes] = await Promise.all([
          this.actionsService.getPublicActions('equipment'),
          this.reasonCodeService.getPublicReasonCodes(),
        ]);
        metadata.actions = equipmentActions;
        metadata.reasonCodes = reasonCodes;
        break;

      case 'operational-alerts':
      case 'handover-alerts':
      case 'customer-feedback':
      case 'health-safety':
      case 'disaster-preparedness':
        // These types only need actions
        const actions = await this.actionsService.getPublicActions(itemListType);
        metadata.actions = actions;
        break;

      default:
        throw new BadRequestException(
          `Invalid item list type: ${itemListType}. Valid types are: inventory, equipment, operational-alerts, handover-alerts, customer-feedback, health-safety, disaster-preparedness`
        );
    }

    return {
      itemListType,
      metadata,
    };
  }
}

