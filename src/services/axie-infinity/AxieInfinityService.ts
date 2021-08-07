import { SmoothLovePotion } from '../../entities/SmoothLovePotion';

export interface AxieInfinityService {
    getSlp(roninAddress: string): Promise<SmoothLovePotion>;
}
