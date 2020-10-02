import log from 'loglevel';

import { qualityToValue } from '@src/common/services/extractors/playerQuality.mapper';

export interface DetailsToolpitData {
    qualityText?: string;
    potentialText?: string;
    penaltiesText?: string;
    experienceText?: string;
    quality?: number;
    potential?: number;
    penalties?: number;
    experience?: number;
    talentText?: string;
}

/* EXAMPLE
 * <a href="relatorio_jog.asp?jog_id=17232824">
 *  <img border="0" width="12" height="12" class="vtip"
 *      title="<font class=comentarios>
 *                  <b>Quality</b>: Low<br />
 *                  <b>Potential</b>: Good<br />
 *                  <b>Penalties</b>: Very Bad<br>
 *                  <b>Experience</b>: Terrible
 *                  <b>Talent</b>: <font class=comentarios>Long-Shots Specialist</font><br>
 *                  <font color=green><b>Gives: </b>+2 finishing, +2 technique</font><br>
 *                  <font color=red><b>Cons: </b>-2 GS (both if you play with Long-Shots)</font>
 *              </font>"
 *      src="img/info.gif">
 * </a>
 */
export class DetailsTooltipExtractor {
    extract(cell: HTMLTableDataCellElement): DetailsToolpitData | undefined {
        const elem = this.getDetailsElement(cell);
        if (elem) {
            const playerTip = this.extractQualityElements(elem);

            this.extractTalent(elem, playerTip);
            this.qualityTextsToValues(playerTip);
            return playerTip;
        } else {
            log.warn('DetailsTooltipExtractor.extract - No img.vtip!', cell.innerHTML);
        }
    }

    private getTipElementText(tipElement: Element, index: number): string | undefined {
        return tipElement.childNodes[index].textContent?.trim().replace(': ', '');
    }

    private qualityTextToValue(
        playerTip: DetailsToolpitData,
        textProperty: 'qualityText' | 'potentialText' | 'penaltiesText' | 'experienceText',
    ): number | undefined {
        const text = playerTip[textProperty];
        if (text) {
            return qualityToValue(text);
        }
    }

    private qualityTextsToValues(playerTip: DetailsToolpitData): void {
        playerTip.quality = this.qualityTextToValue(playerTip, 'qualityText');
        playerTip.potential = this.qualityTextToValue(playerTip, 'potentialText');
        playerTip.penalties = this.qualityTextToValue(playerTip, 'penaltiesText');
        playerTip.experience = this.qualityTextToValue(playerTip, 'experienceText');
    }

    private hasTalent(tipElement: Element): boolean {
        return tipElement.childElementCount > 12;
    }

    private extractTalent(tipElement: Element, playerTip: DetailsToolpitData): void {
        if (this.hasTalent(tipElement)) {
            const talentElement = tipElement.querySelector('font.comentarios');
            if (talentElement) {
                playerTip.talentText = talentElement.textContent?.trim();
            }
        }
    }

    private extractQualityElements(tipElement: Element): DetailsToolpitData {
        return {
            qualityText: this.getTipElementText(tipElement, 1),
            potentialText: this.getTipElementText(tipElement, 4),
            penaltiesText: this.getTipElementText(tipElement, 7),
            experienceText: this.getTipElementText(tipElement, 10),
        };
    }

    // img.title
    private getDetailsElement(cell: HTMLTableDataCellElement): Element | undefined {
        const container = cell.querySelector<HTMLImageElement>('img.vtip');
        if (container) {
            const parser = new DOMParser();

            const htmlDoc = parser.parseFromString(container.title, 'text/html');
            const tipElement = htmlDoc.querySelector('font.comentarios');
            if (!tipElement) {
                log.warn('getDetailsElement - No font.comentarios!', htmlDoc);
                return;
            }
            return tipElement;
        }
    }
}
