export interface FlagItem {
  name: string; // 'Alternate product page';
  kind: 'boolean';
  description: string; // 'This is a description';
  key: string; // 'alternate.page';
  creationDate: number; // 1418684722483;
  includeInSnippet: boolean; // true;
  variations: Array<{ _id: string; value: boolean; name?: string }>;
  // variations: [
  //   {
  //     "_id": "18e82c32-7a27-4ad0-a3b1-d02918ed19e5",
  //     value: true;
  //     name: 'true';
  //   },
  //   {
  //     value: false;
  //     name: 'false';
  //   },
  // ];
  defaults: {
    onVariation: number; // 0;
    offVariation: number; // 1;
  };
  archived: boolean; // false;
  temporary: boolean; // false;
  tags: Array<string>; // ['ops', 'experiments'];
  maintainerId: string; // '548f6741c1efad40031b18ae';
  goalIds: Array<unknown>; // [];
  clientSideAvailability: {
    usingEnvironmentId: boolean;
    usingMobileKey: boolean;
  };
  environments: {
    [env: string]: {
      on: boolean; // true;
      archived: boolean; // false;
      salt: string; // 'YWx0ZXJuYXRlLnBhZ2U=';
      sel: string; // '45501b9314dc4641841af774cb038b96';
      lastModified: number; // 1469326565348;
      version: number; // 61;
      targets: Array<{ values: Array<string>; variation: number }>;
      // targets: [
      //   {
      //     values: ['1461797806427-7-115540266'];
      //     variation: 0;
      //   },
      //   {
      //     values: ['Gerhard.Little@yahoo.com'];
      //     variation: 1;
      //   },
      // ];
      rules: Array<{
        variation: number;
        clauses: Array<{ attribute: string; op: string; values: Array<string>; negate: boolean }>;
      }>;
      // rules: [
      //   {
      //     variation: 0;
      //     clauses: [
      //       {
      //         attribute: 'groups';
      //         op: 'in';
      //         values: ['Top Customers'];
      //         negate: false;
      //       },
      //       {
      //         attribute: 'email';
      //         op: 'endsWith';
      //         values: ['gmail.com'];
      //         negate: false;
      //       },
      //     ];
      //   },
      // ];
      // fallthrough: {
      //   rollout: {
      //     variations: Array<{ variation: number; weight: number }>;
      //   };
      // };
      fallthrough: {
        variation: number;
      };
      // fallthrough: {
      //   rollout: {
      //     variations: [
      //       {
      //         variation: 0;
      //         weight: 60000;
      //       },
      //       {
      //         variation: 1;
      //         weight: 40000;
      //       },
      //     ];
      //   };
      // };
      offVariation: number; // 1;
      prerequisites: Array<unknown>; // [];
      // "_summary": {
      //   "variations": {
      //     "0": { "rules": 0, "nullRules": 0, "targets": 1, "isFallthrough": true },
      //     "1": { "rules": 0, "nullRules": 0, "targets": 0, "isOff": true }
      //   },
      //   "prerequisites": 0
      // }
      _summary: {
        variations: {
          // Could be 0, 1, 2, ... (or just a single number)
          [variationIndex: string]: {
            rules: number;
            nullRules: number;
            targets: number;
            isOff?: true;
            isFallthrough?: true;
          };
        };
        prerequisites: 0;
      };
    };
  };
}
