// Copyright (C) 2023 Platinum
// 
// This file is part of Two Slot Extended Mags.
// 
// Two Slot Extended Mags is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Two Slot Extended Mags is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Two Slot Extended Mags.  If not, see <http://www.gnu.org/licenses/>.

import { DependencyContainer } from "tsyringe";

import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ITemplateItem, Props } from "@spt/models/eft/common/tables/ITemplateItem";

import config from "../config.json";

class TwoSlotExtendedMags implements IPostDBLoadMod {
  private logger: ILogger;

  readonly modName = "Two Slot Extended Mags";

  public postDBLoad(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>("WinstonLogger");

    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const tables = databaseServer.getTables();
    const itemTable = tables.templates.items;

    this.updateExtendedMagsInventorySlotSize(itemTable);
  }

  private updateExtendedMagsInventorySlotSize(itemTable: Record<string, ITemplateItem>): void {
    let itemsChanged = 0;

    for (const itemId in itemTable) {
      const item = itemTable[itemId];

      if (this.isExtendedMag(item)) {
        const itemProp = item._props;

        itemProp.Height = 2;

        if (itemProp.ExtraSizeDown) {
          itemProp.ExtraSizeDown--;
        }

        itemsChanged++;
      }
    }

    this.logger.success(`[${this.modName}]: Updated ${itemsChanged} extended mags.`);
    this.logger.success(`[${this.modName}]: If you have issues with the icon size, please go to SPT Launcher > Settings > Clean Temp Files.`);
  }

  private isExtendedMag(item: ITemplateItem): boolean {
    const magazineCategoryId = "5448bc234bdc2d3c308b4569";
    
    return item._parent == magazineCategoryId &&
      item._props.Width == 1 && // We don't want to make horizontal mags like P90's to be 4 squares wide or change drum mags (for now)
      item._props.Height > 2 &&
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
