import { DialogueHelper } from "../helpers/DialogueHelper";
import { ItemHelper } from "../helpers/ItemHelper";
import { ProfileHelper } from "../helpers/ProfileHelper";
import { QuestConditionHelper } from "../helpers/QuestConditionHelper";
import { QuestHelper } from "../helpers/QuestHelper";
import { IPmcData } from "../models/eft/common/IPmcData";
import { Item } from "../models/eft/common/tables/IItem";
import { AvailableForConditions, IQuest, Reward } from "../models/eft/common/tables/IQuest";
import { IRepeatableQuest } from "../models/eft/common/tables/IRepeatableQuests";
import { IItemEventRouterResponse } from "../models/eft/itemEvent/IItemEventRouterResponse";
import { IAcceptQuestRequestData } from "../models/eft/quests/IAcceptQuestRequestData";
import { ICompleteQuestRequestData } from "../models/eft/quests/ICompleteQuestRequestData";
import { IHandoverQuestRequestData } from "../models/eft/quests/IHandoverQuestRequestData";
import { IQuestConfig } from "../models/spt/config/IQuestConfig";
import { ILogger } from "../models/spt/utils/ILogger";
import { EventOutputHolder } from "../routers/EventOutputHolder";
import { ConfigServer } from "../servers/ConfigServer";
import { DatabaseServer } from "../servers/DatabaseServer";
import { LocaleService } from "../services/LocaleService";
import { LocalisationService } from "../services/LocalisationService";
import { PlayerService } from "../services/PlayerService";
import { HttpResponseUtil } from "../utils/HttpResponseUtil";
import { TimeUtil } from "../utils/TimeUtil";
export declare class QuestController {
    protected logger: ILogger;
    protected timeUtil: TimeUtil;
    protected httpResponseUtil: HttpResponseUtil;
    protected eventOutputHolder: EventOutputHolder;
    protected databaseServer: DatabaseServer;
    protected itemHelper: ItemHelper;
    protected dialogueHelper: DialogueHelper;
    protected profileHelper: ProfileHelper;
    protected questHelper: QuestHelper;
    protected questConditionHelper: QuestConditionHelper;
    protected playerService: PlayerService;
    protected localeService: LocaleService;
    protected localisationService: LocalisationService;
    protected configServer: ConfigServer;
    protected questConfig: IQuestConfig;
    constructor(logger: ILogger, timeUtil: TimeUtil, httpResponseUtil: HttpResponseUtil, eventOutputHolder: EventOutputHolder, databaseServer: DatabaseServer, itemHelper: ItemHelper, dialogueHelper: DialogueHelper, profileHelper: ProfileHelper, questHelper: QuestHelper, questConditionHelper: QuestConditionHelper, playerService: PlayerService, localeService: LocaleService, localisationService: LocalisationService, configServer: ConfigServer);
    /**
     * Get all quests visible to player
     * Exclude quests with incomplete preconditions (level/loyalty)
     * @param sessionID session id
     * @returns array of IQuest
     */
    getClientQuests(sessionID: string): IQuest[];
    /**
     * Is the quest for the opposite side the player is on
     * @param playerSide Player side (usec/bear)
     * @param questId QuestId to check
     */
    protected questIsForOtherSide(playerSide: string, questId: string): boolean;
    /**
     * Handle the client accepting a quest and starting it
     * Send starting rewards if any to player and
     * Send start notification if any to player
     * @param pmcData Profile to update
     * @param acceptedQuest Quest accepted
     * @param sessionID Session id
     * @returns client response
     */
    acceptQuest(pmcData: IPmcData, acceptedQuest: IAcceptQuestRequestData, sessionID: string): IItemEventRouterResponse;
    /**
     * Handle the client accepting a repeatable quest and starting it
     * Send starting rewards if any to player and
     * Send start notification if any to player
     * @param pmcData Profile to update with new quest
     * @param acceptedQuest Quest being accepted
     * @param sessionID Session id
     * @returns IItemEventRouterResponse
     */
    acceptRepeatableQuest(pmcData: IPmcData, acceptedQuest: IAcceptQuestRequestData, sessionID: string): IItemEventRouterResponse;
    /**
     * Look for an accepted quest inside player profile, return matching
     * @param pmcData Profile to search through
     * @param acceptedQuest Quest to search for
     * @returns IRepeatableQuest
     */
    protected getRepeatableQuestFromProfile(pmcData: IPmcData, acceptedQuest: IAcceptQuestRequestData): IRepeatableQuest;
    /**
     * Update completed quest in profile
     * Add newly unlocked quests to profile
     * Also recalculate thier level due to exp rewards
     * @param pmcData Player profile
     * @param body Completed quest request
     * @param sessionID Session id
     * @returns ItemEvent client response
     */
    completeQuest(pmcData: IPmcData, body: ICompleteQuestRequestData, sessionID: string): IItemEventRouterResponse;
    /**
     * Send a popup to player on successful completion of a quest
     * @param sessionID session id
     * @param pmcData Player profile
     * @param completedQuestId Completed quest id
     * @param questRewards Rewards given to player
     */
    protected sendSuccessDialogMessageOnQuestComplete(sessionID: string, pmcData: IPmcData, completedQuestId: string, questRewards: Reward[]): void;
    /**
     * Look for newly available quests after completing a quest with a requirement to wait x minutes (time-locked) before being available and add data to profile
     * @param pmcData Player profile to update
     * @param quests Quests to look for wait conditions in
     * @param completedQuestId Quest just completed
     */
    protected addTimeLockedQuestsToProfile(pmcData: IPmcData, quests: IQuest[], completedQuestId: string): void;
    /**
     * Returns a list of quests that should be failed when a quest is completed
     * @param completedQuestId quest completed id
     * @returns array of quests
     */
    protected getQuestsFailedByCompletingQuest(completedQuestId: string): IQuest[];
    /**
     * Fail the quests provided
     * Update quest in profile, otherwise add fresh quest object with failed status
     * @param sessionID session id
     * @param pmcData player profile
     * @param questsToFail quests to fail
     */
    protected failQuests(sessionID: string, pmcData: IPmcData, questsToFail: IQuest[]): void;
    /**
     *
     * @param pmcData Player profile
     * @param handoverQuestRequest handover item request
     * @param sessionID Session id
     * @returns IItemEventRouterResponse
     */
    handoverQuest(pmcData: IPmcData, handoverQuestRequest: IHandoverQuestRequestData, sessionID: string): IItemEventRouterResponse;
    /**
     * Show warning to user and write to log that repeatable quest failed a condition check
     * @param handoverQuestRequest Quest request
     * @param output Response to send to user
     * @returns IItemEventRouterResponse
     */
    protected showRepeatableQuestInvalidConditionError(handoverQuestRequest: IHandoverQuestRequestData, output: IItemEventRouterResponse): IItemEventRouterResponse;
    /**
     * Show warning to user and write to log quest item handed over did not match what is required
     * @param handoverQuestRequest Quest request
     * @param itemHandedOver Non-matching item found
     * @param handoverRequirements Quest handover requirements
     * @param output Response to send to user
     * @returns IItemEventRouterResponse
     */
    protected showQuestItemHandoverMatchError(handoverQuestRequest: IHandoverQuestRequestData, itemHandedOver: Item, handoverRequirements: AvailableForConditions, output: IItemEventRouterResponse): IItemEventRouterResponse;
    /**
     * Increment a backend counter stored value by an amount,
     * Create counter if it does not exist
     * @param pmcData Profile to find backend counter in
     * @param conditionId backend counter id to update
     * @param questId quest id counter is associated with
     * @param counterValue value to increment the backend counter with
     */
    protected updateProfileBackendCounterValue(pmcData: IPmcData, conditionId: string, questId: string, counterValue: number): void;
}
