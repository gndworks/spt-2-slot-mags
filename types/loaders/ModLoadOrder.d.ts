import { IPackageJsonData } from "@spt/models/spt/mod/IPackageJsonData";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { LocalisationService } from "@spt/services/LocalisationService";
export declare class ModLoadOrder {
    protected logger: ILogger;
    protected localisationService: LocalisationService;
    protected mods: Map<string, IPackageJsonData>;
    protected modsAvailable: Map<string, IPackageJsonData>;
    protected loadOrder: Map<string, IPackageJsonData>;
    constructor(logger: ILogger, localisationService: LocalisationService);
    setModList(mods: Record<string, IPackageJsonData>): Map<string, IPackageJsonData>;
    getLoadOrder(): string[];
    getModsOnLoadBefore(mod: string): Set<string>;
    getModsOnLoadAfter(mod: string): Set<string>;
    protected invertLoadBefore(mod: string): void;
    protected getLoadOrderRecursive(mod: string, visited: Set<string>): void;
}
