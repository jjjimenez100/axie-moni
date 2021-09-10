# Axie-Moni
Axie-infinity services for fetching current SLP <> PHP price, ronin address details, and tracking. Integrated within a personal discord channel.

# Tests and Coverage
```
------------------------------------------|---------|----------|---------|---------|-------------------
File                                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------------------------|---------|----------|---------|---------|-------------------
All files                                 |      90 |    89.29 |   80.28 |    91.6 |                   
 crons                                    |   95.24 |      100 |      75 |     100 |                   
  check-slp-price-within-threshold.ts     |   95.24 |      100 |      75 |     100 |                   
 entities                                 |     100 |      100 |     100 |     100 |                   
  SmoothLovePotion.ts                     |     100 |      100 |     100 |     100 |                   
 lib                                      |       0 |      100 |       0 |       0 |                   
  LoggerImpl.ts                           |       0 |      100 |       0 |       0 | 1-45              
 lib/http-client                          |   78.95 |      100 |      75 |   77.78 |                   
  AxiosHttpClient.ts                      |   69.23 |      100 |   66.67 |   69.23 | 28-33             
  HttpClientError.ts                      |     100 |      100 |     100 |     100 |                   
 services                                 |     100 |      100 |     100 |     100 |                   
  Currency.ts                             |     100 |      100 |     100 |     100 |                   
 services/axie-infinity                   |     100 |      100 |     100 |     100 |                   
  DefaultAxieInfinityService.ts           |     100 |      100 |     100 |     100 |                   
  TimezoneNotSupportedError.ts            |     100 |      100 |     100 |     100 |                   
 services/crypto-currency                 |     100 |      100 |     100 |     100 |                   
  CoingeckoService.ts                     |     100 |      100 |     100 |     100 |                   
  CryptoCurrencyCode.ts                   |     100 |      100 |     100 |     100 |                   
  GetCryptoPriceError.ts                  |     100 |      100 |     100 |     100 |                   
  UnexpectedTypeOnCryptoPriceError.ts     |     100 |      100 |     100 |     100 |                   
 services/discord                         |   89.66 |    78.57 |      76 |   92.59 |                   
  DefaultDiscordManager.ts                |   82.76 |       75 |   55.56 |   88.46 | 15,30,43          
  DefaultDiscordService.ts                |   92.31 |      100 |      60 |      96 | 20                
  DiscordCommandList.ts                   |   86.67 |       50 |     100 |   84.62 | 21,31             
  EventHook.ts                            |     100 |      100 |     100 |     100 |                   
  FailedToInitializeDiscordClientError.ts |     100 |      100 |     100 |     100 |                   
  FailedToSendDiscordMessageError.ts      |     100 |      100 |     100 |     100 |                   
  UnrecognizedEventHookError.ts           |     100 |      100 |     100 |     100 |                   
 services/discord/commands                |     100 |      100 |     100 |     100 |                   
  GetSlpPriceCommand.ts                   |     100 |      100 |     100 |     100 |                   
  GetSlpTotalForRoninAddressCommand.ts    |     100 |      100 |     100 |     100 |                   
 services/scheduler                       |   96.88 |      100 |    87.5 |     100 |                   
  DefaultScheduledJob.ts                  |     100 |      100 |     100 |     100 |                   
  DefaultScheduler.ts                     |   88.89 |      100 |      50 |     100 |                   
  FailedToCreateScheduledJobError.ts      |     100 |      100 |     100 |     100 |                   
  FailedToStartScheduledJobError.ts       |     100 |      100 |     100 |     100 |                   
  FailedToStopScheduledJobError.ts        |     100 |      100 |     100 |     100 |                   
------------------------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 90% ( 225/250 )
Branches     : 89.29% ( 25/28 )
Functions    : 80.28% ( 57/71 )
Lines        : 91.6% ( 218/238 )
================================================================================
Test Suites: 12 passed, 12 total
Tests:       51 passed, 51 total
Snapshots:   0 total
```
