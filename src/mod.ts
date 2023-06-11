

import { DependencyContainer } from "tsyringe";

import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ITemplateItem, Props } from "@spt-aki/models/eft/common/tables/ITemplateItem";

import config from "../config.json";

class TwoSlotExtendedMags implements IPostDBLoadMod {
  private logger: ILogger;

  public postDBLoad(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");

    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const tables = databaseServer.getTables();
    const itemTable = tables.templates.items;

    this.updateExtendedMagsInventorySlotSize(itemTable);

    this.logger.success(`Downsized!`);
  }

  private updateExtendedMagsInventorySlotSize(itemTable: Record<string, ITemplateItem>): void {
    for (const itemId in itemTable) {
      const item = itemTable[itemId];

      if (this.isExtendedMag(item)) {
        const itemProp = item._props;

        itemProp.Height = 2;

        if (itemProp.ExtraSizeDown) {
          itemProp.ExtraSizeDown--;
        }
      }
    }
  }

  private isExtendedMag(item: ITemplateItem): boolean {
    const magazineCategoryId = "5448bc234bdc2d3c308b4569";
    
    return item._parent == magazineCategoryId &&
      item._props.Width == 1 && // We don't want to make horizontal mags like P90's to be 4 squares wide or change drum mags (for now)
      this.isWithinMagazineSizeCapacity(item._props);
  }

  private isWithinMagazineSizeCapacity(itemProp: Props): boolean {
    const capacity = this.getMagazineCapacity(itemProp);

    return capacity >= config.minMagazineCapacityToBeIncluded && capacity <= config.maxMagazineCapacityToBeIncluded;
  }

  private getMagazineCapacity(itemProp: Props): number {
    return itemProp.Cartridges?.find(cartridge => cartridge._max_count != null)?._max_count;
  }

  
}

module.exports = { mod: new TwoSlotExtendedMags() };
