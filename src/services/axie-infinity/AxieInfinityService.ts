import { SmoothLovePotion } from '../../entities/SmoothLovePotion';
import { Currency } from '../Currency';

export interface AxieInfinityService {
    getSlp(roninAddress: string): Promise<SmoothLovePotion>;
    getSlpPriceInCurrencyOf(currency: Currency): Promise<number>;
}
