import log from 'loglevel';

import { extractDate } from '../dateExtractor';

describe('DateExtractor', () => {
    it('Extract date in the English version', () => {
        document.body.innerHTML =
            '<div><div id="dateTime">' +
            '<table width="97%"><tbody><tr>' +
            '<td style="text-align: right;"><img style="padding-right: 5px;" src="../images/icon_calendar.png"></td>' +
            '<td width="1%" style="color: #e0e9b9; font-weight: bold; font-size: 12px;" nowrap="">' +
            ' <span id="tempo">18:02:32</span>, <span id="data">15 October 2020</span> | Day&nbsp;4/77, Se&nbsp;76' +
            '</td>' +
            ' </tr></tbody></table>' +
            '</div></div>';
        const result = extractDate(document.body);
        expect(result).toEqual({ day: 4, season: 77 });
    });

    it('Extract date in the Arabic version', () => {
        document.body.innerHTML = `<div><div id="dateTime">
        	<table width="97%"><tbody><tr>
        		<td style="text-align: left;"><img style="padding-left: 5px;" src="../images/icon_calendar.png"></td>
                <td width="1%" style="color: #e0e9b9; font-weight: bold; font-size: 12px;" nowrap="">
                <span id="tempo">18:19:55</span>, <span id="data">15 أكتوبر 2020</span> | اليوم&nbsp;15/76, ال&nbsp;76</td>
        	</tr></tbody></table>
        	<!--<p class="cal"><span id='tempo'>00:00:00</span>, <span id='data'>30 October 2004</span></p>-->
        	</div></div>`;
        const result = extractDate(document.body);
        expect(result).toEqual({ day: 15, season: 76 });
    });
});
