# EVTJS

 ![node-support](https://img.shields.io/badge/node-%3E6.0.0-brightgreen.svg) ![browser](https://img.shields.io/badge/browser-supported-brightgreen.svg) ![npm](https://img.shields.io/npm/v/evtjs.svg) ![language](https://img.shields.io/badge/language-javascript-orange.svg) ![license](https://img.shields.io/npm/l/evtjs.svg)

General purpose API Binding for the everiToken blockchain.

We choose `JavaScript` as our major language for SDK as almost every major platform supports `JavaScript`.

For web applications, You can use `evtjs` directly in browsers.

For mobile applications, you can use `evtjs` by `WebView` in Android & iOS or via `React Native`. 

For backend applications, use `evtjs` via `nodejs`.

## Install

### NodeJS

For NodeJS, use `npm`:

```bash
npm install evtjs --save
```

Or use `yarn`:

```bash
yarn add evtjs
```

#### Optional dependencies

A C binding library for `libsecp256k1` could be compiled and installed if you want to sign on the transaction faster. All major platforms are supported except mobile devices:

```bash
npm install secp256k1
```

Using `libsecp256k1` can make the signing about 100 times faster.

### Browsers

For browser, you may download the source code and compile it for browsers in the root directory:

```js
npm run build_browser
```

Then you'll find produced `evt.min.js` in `dist` folder.

You can also download our pre-compiled release package directly.

## Basic Usage
```js
// set network endpoint
const network = {
    host: 'testnet1.everitoken.io', // For everiToken Aurora 2.0
    port: 8888,                     // defaults to 8888
    protocol: 'https'               // the TestNet of everiToken uses SSL
};

// get APICaller instance
const apiCaller = EVT({
    // keyProvider should be string of private key (aka. wit, can generate from everiSigner)
    // you can also pass a function that return that string (or even Promise<string> for a async function)
    endpoint: network,
    keyProvider: 'xxxxxxxxxxxxxxxxxxxxxxxxxx'
});

// call API
var response = await apiCaller.getInfo();

// or if `await` is supported in current environment
apiCaller.getInfo()
    .then(res => {
        // TODO
    })
    .catch((e) => {
        // TODO
    });

```

## EvtKey Usage

`EvtKey` is a class for everiToken's key management. 

### randomPrivateKey() => Promise&lt;string>

You can get a random private key by `EVT.EvtKey.randomPrivateKey`:

```js
// randomPrivateKey returns a promise so we should use await or 'then' 
let key = await EVT.EvtKey.randomPrivateKey();

// now key is the private key (as wit format).
```

### privateToPublic(privateKey) => string

After generating a private key, you can convert it to a public key by `privateToPublic`.

#### Parameters

- `privateKey`: the private key you want to convert.

```js
let publicKey = EVT.EvtKey.privateToPublic(key);
```

### seedPrivateKey(seed) => string

Get a private key from a specific `seed`. 

#### Parameters

- `seed`: The `seed` is a string. For private key's safety, the `seed` must be random enough and must have at least 32 bytes' length.

```js
let privateKey = EVT.EvtKey.seedPrivateKey('AVeryVeryVeryLongRandomSeedHere');
```

### isValidPrivateKey(key) / isValidPublicKey(key) => boolean

You can use `isValidPrivateKey` or `isValidPublicKey` to check a key.

#### Parameters

- `key`: The private / public key you want to check.

### isValidAddress(address) => boolean

You can use `isValidAddress` to check if a `address` is valid. a `addres` is valid if it is a `public key` or it's equal to `Null Address` or it is a special generated address.

#### Parameters

- `key`: The address you want to check.

```js
    assert(EVT.EvtKey.isValidPrivateKey('5J1by7KRQujRdXrurEsvEr2zQGcdPaMJRjewER6XsAR2eCcpt3D'), 'should be a valid private');
    assert(EVT.EvtKey.isValidPublicKey('EVT6Qz3wuRjyN6gaU3P3XRxpnEZnM4oPxortemaWDwFRvsv2FxgND'), 'should be a valid public');
```

### random32BytesAsHex() => Promise&lt;string>

You may generate a 32-byte-long hex string and it is promised to be safe in cryptography.

> This is a `async` function. Please use `then` or `await` for the result accordingly.

### randomName128() => Promise&lt;string>

Produces a safe string with a length of 21. This is suitable for use in ABI structure where it requires a `name128` type such as `proposalName` for a suspended transaction.

> This is a `async` function. Please use `then` or `await` for the result accordingly.

### getNullAddress() => string

Return a string representing a null address. 

The response of this function is always `"EVT00000000000000000000000000000000000000000000000000"`.

Null address is used for representing destroyed tokens and immutable groups.

## APICaller Usage

### Initialization

Before calling APICaller, you must initialize a instance of it.

A APICaller object could be created like this:

```js
// get APICaller instance
var apiCaller = EVT(args);
```

#### Parameters

- `args`: a object, the following fields are required:
  - `keyProvider`: keyProvider should be string or a array of string representing private keys, or a function which returns one private key or one array of several keys or a `Promise` that will resolves with one private key or one array of several key.
  - `endpoint`: a object to specify the endpoint of the node to be connected.
  - `networkTimeout`: (optional) Timeout in milliseconds. The default value is 15000.

Here are several example of `keyProvider`:

```js
// keyProvider is the private key
let keyProvider = '5J1by7KRQujRdXrurEsvEr2zQGcdPaMJRjewER6XsAR2eCcpt3D';

// keyProvider is the array of private key
let keyProvider = [ '5J1by7KRQujRdXrurEsvEr2zQGcdPaMJRjewER6XsAR2eCcpt3D', '5KjJUS14wBNgHGRW1NYPFgfJotnS6jvwv7wzvfc75zAqfPWYmhD' ];

// keyProvider is a function
let keyProvider = function() {
    return [
        '5J1by7KRQujRdXrurEsvEr2zQGcdPaMJRjewER6XsAR2eCcpt3D', '5KjJUS14wBNgHGRW1NYPFgfJotnS6jvwv7wzvfc75zAqfPWYmhD'
    ];
}

// keyProvider is a async function
let keyProvider = function() {
    return new Promise((res, rej) => {
        res('5J1by7KRQujRdXrurEsvEr2zQGcdPaMJRjewER6XsAR2eCcpt3D'); // or a array
    });
}
```

If you provide a array instead of a single key, `evtjs` will choose which keys should be used for signing automatically by calling everiToken's API `get_required_keys`. `evtjs` supports `multisign` so it may use more than one keys for signing on a transaction.

A example of `endpoint`:

```js
// endpoint is a object
// example: 
let endpoint = {
    host: 'testnet1.everitoken.io', // For everiToken Aurora 2.0
    port: 8888,                     // defaults to 8888
    protocol: 'https'               // the TestNet of everiToken uses SSL
};
```

### getInfo() => Promise

get basic information from block chain.

```js
let info = await apiCaller.getInfo();
```

#### Example Response

```json
{
    "server_version": "3813c635",
    "chain_id": "bb248d6319e51ad38502cc8ef8fe607eb5ad2cd0be2bdc0e6e30a506761b8636",
    "evt_api_version": "1.2.0",
    "head_block_num": 145469,
    "last_irreversible_block_num": 145468,
    "last_irreversible_block_id": "0002383c51a24696917c8e6ba24557a138510d7f73196d0b11d447fd7f4b6eb7",
    "head_block_id": "0002383d5378cb6ba3d261c2df459e2413a211e8211a11a22cd614b18a293bb5",
    "head_block_time": "2018-06-05T04:56:29",
    "head_block_producer": "evt",
    "recent_slots": "",
    "participation_rate": "0.00000000000000000"
}
```

Some important return values are as follow:

- `evt_api_version`: This is important and _must be verified before any other call_ . 
  
  Format: [ major.minor.modification ]. When `major` is changed then you could not use the chain's API. It is not compatible with you.

- `head_block_*` and `last_irreversible_block_*`: Represents information for last block / last irreversible block. This is used by other calls automatically by the library.

### getHeadBlockHeaderState() => Promise

Get header state of head block of current everiToken chain. This is useful if you want to get some information from the chain node. For example, you can get server's current `timestamp`.

#### Response

Here is an example:

```json
{
    "id": "00008f4001f64c7d0aaa21220bb111b5e1db0a75587b022284a9cd945921d1ee",
    "block_num": 36672,
    "header": {
        "timestamp": "2018-07-23T08:18:03.000",
        "producer": "evt",
        "confirmed": 0,
        "previous": "00008f3f72803da575e85f8477346543029d7c407d58bdd2703c9306f1727761",
        "transaction_mroot": "0000000000000000000000000000000000000000000000000000000000000000",
        "action_mroot": "0000000000000000000000000000000000000000000000000000000000000000",
        "schedule_version": 0,
        "header_extensions": [],
        "producer_signature": "SIG_K1_K5jEdrTZ6NFi6NVd6rKv97Lwxegwnzi4pHcNhJn2hL6X2JL7DK73fakioCYcDiHB74ouX1wkeQicKX5hnrEZ54dFPvpkYJ"
    },
    "dpos_proposed_irreversible_blocknum": 36672,
    "dpos_irreversible_blocknum": 36671,
    "bft_irreversible_blocknum": 0,
    "pending_schedule_lib_num": 0,
    "pending_schedule_hash": "b6dfee2073f7863993ed3ebc33c4781fb7c0beedff7b5478bff7111a71fd9df4",
    "pending_schedule": {
        "version": 0,
        "producers": []
    },
    "active_schedule": {
        "version": 0,
        "producers": [
            {
                "producer_name": "evt",
                "block_signing_key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
            }
        ]
    },
    "blockroot_merkle": {
        "_active_nodes": [
            "00008f3f72803da575e85f8477346543029d7c407d58bdd2703c9306f1727761",
            "14903e37ffc3c312f1913c6f5bdcfe0534622630492d7ec309cf9650f36c2e43",
            "f6a956062e72352f9cc55c1c8ea976a4c815ea805d003d510b15b77a9f79850a",
            "c46df6cf6bf778b0c67f4baee6b565f82fbcd68d2e341855e556da4a722ec0f2",
            "8dd090093a15d4fff1fe8ee93c7a4dc8ba95d6a30ddf1bfd6a65e064671c88ab",
            "475a4e690ccb2efd4bfb083dae25795d6baef43edfb6d3b711b0d5f1064357bb",
            "8485b584bc26f5bb7df9db686d0501acca38959d5bde35a0e392514497bcee5e",
            "6bce5e13a200b1b1671161e8f825508dd8189620d83ad1c6c389725d1a26c2b9",
            "b1cbf65e93f33a945d305172c3d41f56f3b9b470c9963c18f3edff41e24df6d2",
            "6e47ee8c118c61a8b5d17dcfccbe66083256dcf55c7136ac9c3de47e570a61c2",
            "18569ad93482be45a7fb925df9e531cdc16639849f0a3b43a55ae67d2ac97118",
            "e08e415237bafbb170b9099fc54f3b203806e844005dfe6de362d196b3f30f12"
        ],
        "_node_count": 36671
    },
    "producer_to_last_produced": [
        [
            "evt",
            36672
        ]
    ],
    "producer_to_last_implied_irb": [
        [
            "evt",
            36671
        ]
    ],
    "block_signing_key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "confirm_count": [],
    "confirmations": []
}
```

### getOwnedTokens(publicKeys) => Promise

Get the list of tokens which is owned by `publicKeys`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `publicKey`: an array or a single value which represents public keys you want to query

#### Response

The response is an array representing the list of tokens belonging to public keys provided. Each token is identified by the `name` and the `domain` it belongs to.

A example:

```json
[
    {
        "name": "T39823",
        "domain": "test"
    }
]
```

### getManagedGroups(publicKeys) => Promise

Get the list of groups which is managed by `publicKeys`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `publicKey`: an array or a single value which represents public keys you want to query

#### Response

The response is an array representing the list of groups managed by public keys provided. Each group is identified by the `name`.

A example:

```json
[
    {
        "name": "testgroup"
    }
]
```

### getCreatedDomains(publicKeys) => Promise

Get the list of domains which is created by `publicKeys`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `publicKey`: an array or a single value which represents public keys you want to query

#### Response

The response is an array representing the list of domains created by public keys provided. Each domain is identified by the `name`.

A example:

```json
[
    {
        "name": "testdomain"
    }
]
```

### getCreatedFungibles(publicKeys) => Promise

Get the list of fungibles which is created by `publicKeys`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `publicKey`: an array or a single value which represents public keys you want to query

#### Response

The response is an array representing the list of fungibles created by public keys provided. Each fungible is identified by the `id`.

A example:

```json
{
    ids: [3, 4, 5]
}
```

### getActions(params) => Promise

Get the list of actions. Supports filtering by `domain`, `key`, and `action name`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `params`: a object with the follow members:
  - `domain`: The domain to filter the result. It is required. Some special domains are supported, such as `.fungible`
  - `key`: The key to filter the result. The value of it is the same as you provided one in `pushTransaction`. Optional.
  - `names`: an array to filter the action name. Optional.
  - `skip`: The count to skip in the result. This is for paging.
  - `take`: The count to take after skipping. This is for paging.

#### Response

The response is an array representing the list of actions.

A example:

```json
[{
    "name": "newfungible",
    "domain": ".fungible",
    "key": "23",
    "trx_id": "f0c789933e2b381e88281e8d8e750b561a4d447725fb0eb621f07f219fe2f738",
    "data": {
      "sym": "5,S#23",
      "sym_name": "ABC",
      "name": "ABC TOKEN",
      "creator": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
      "issue": {
        "name": "issue",
        "threshold": 1,
        "authorizers": [{
            "ref": "[A] EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
            "weight": 1
          }
        ]
      },
      "manage": {
        "name": "manage",
        "threshold": 1,
        "authorizers": [{
            "ref": "[A] EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
            "weight": 1
          }
        ]
      },
      "total_supply": "100000.00000 EVT"
    }
  }
]
```

### getFungibleBalance(address, [symbolId]) => Promise

Get the list of fungible balance of a user.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `address`: The address (public key) you want to query.
- `symbolId`: The symbol id you want to query (number), optional. For example: 1.

#### Response

The response is an array representing the list of balance.

A example:

```json
[
  "2.00000 S#1", "1.00000 S#2"
]
```

### getTransactionDetailById(id) => Promise

Get detail information about a transaction by its `id`. 

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `id`: The id to query. `pushTransaction` will return the id of the transaction it created.

#### Response

The response is the detail information about a transaction.

A example:

```json
{
  "id": "f0c789933e2b381e88281e8d8e750b561a4d447725fb0eb621f07f219fe2f738",
  "signatures": [
    "SIG_K1_K6hWsPBt7VfSrYDBZqCygWT8dbA6R3mpxKPjd3JUh18EQHfU55eVEkHgq8AR5odWjPXvYasZQ1LoNdaLKKhagJXXuXp3Y2"
  ],
  "compression": "none",
  "packed_trx": "bb72345b050016ed2e620001000a13e9b86a6e7100000000000000000000d0d5505206460000000000000000000000000040beabb00105455654000000000003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a970000000008052e74c01000000010100000003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a9700000000000000001000000000094135c6801000000010100000003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a97000000000000000010000e40b5402000000054556540000000000",
  "transaction": {
    "expiration": "2018-06-28T05:31:39",
    "ref_block_num": 5,
    "ref_block_prefix": 1647242518,
    "delay_sec": 0,
    "actions": [{
        "name": "newfungible",
        "domain": ".fungible",
        "key": "1",
        "data": {
          "sym": "5,S#1",
          "sym_id": "EVT",
          "name": "EVT",
          "creator": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
          "issue": {
            "name": "issue",
            "threshold": 1,
            "authorizers": [{
                "ref": "[A] EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                "weight": 1
              }
            ]
          },
          "manage": {
            "name": "manage",
            "threshold": 1,
            "authorizers": [{
                "ref": "[A] EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                "weight": 1
              }
            ]
          },
          "total_supply": "100000.00000 EVT"
        },
        "hex_data": "05455654000000000003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a970000000008052e74c01000000010100000003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a9700000000000000001000000000094135c6801000000010100000003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a97000000000000000010000e40b54020000000545565400000000"
      }
    ],
    "transaction_extensions": []
  }
}
```

### getDomainDetail(name) => Promise

Get detail information about a domain by its `name`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `name`: The name of the domain you want to query

#### Response

The response is the detail information of the domain you queried.

A example:

```json
{
    "name": "cookie",
    "creator": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "issue_time": "2018-06-09T09:06:27",
    "issue": {
        "name": "issue",
        "threshold": 1,
        "authorizers": [{
                "ref": "[A] EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                "weight": 1
            }
        ]
    },
    "transfer": {
        "name": "transfer",
        "threshold": 1,
        "authorizers": [{
                "ref": "[G] .OWNER",
                "weight": 1
            }
        ]
    },
    "manage": {
        "name": "manage",
        "threshold": 1,
        "authorizers": [{
                "ref": "[A] EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                "weight": 1
            }
        ]
    }
}
```

### getGroupDetail(name) => Promise

Get detail information about a group by its `name`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `name`: The name of the group you want to query

#### Response

The response is the detail information of the group you queried.

A example:

```json
{
    "name": "testgroup",
    "key": "EVT5RsxormWcjvVBvEdQFonu5RNG4js8Zvz9pTjABLZaYxo6NNbSJ",
    "root": {
        "threshold": 6,
        "weight": 0,
        "nodes": [{
                "threshold": 1,
                "weight": 3,
                "nodes": [{
                        "key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                        "weight": 1
                    }, {
                        "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                        "weight": 1
                    }
                ]
            }, {
                "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                "weight": 3
            }, {
                "threshold": 1,
                "weight": 3,
                "nodes": [{
                        "key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                        "weight": 1
                    }, {
                        "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                        "weight": 1
                    }
                ]
            }
        ]
    }
}
```

### getFungibleActionsByAddress(symbolId, address, [skip = 0], [take = 10]) => Promise&lt;Array>

Query fungible actions by address.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `symbolId`: The symbol Id (number) that you want to query for.
- `address`: The address that you want to query for.
- `skip`: The count to skip before taking data from the list, for paging. Optional.
- `take`: The count to take, for paging. Optional.

#### Response

The response is an array consisting of the detail information of actions you queried.

A example:

```json
[{
    "name": "transferft",
    "domain": ".fungible",
    "key": "338422621",
    "trx_id": "58034b28635c027f714fb01de202ae0ccefa1a4ba5bcf5f01b04fc53b79e6449",
    "data": {
      "from": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
      "to": "EVT6dpW7dAtR7YEAxatwA37sYZBdfQCtPD8Hoa1d7jnVDnCepNcM8",
      "number": "1.0000000000 S#338422621",
      "memo": "goodjob"
    },
    "created_at": "2018-08-08T08:21:44.001"
  },
  {
    "name": "issuefungible",
    "domain": ".fungible",
    "key": "338422621",
    "trx_id": "b05a0cea2093de4ca6eee0ca46ebfa0196ef6dad90a0bcc61f90b6a12bbbd30b",
    "data": {
      "address": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
      "number": "100.0000000000 S#338422621",
      "memo": "goodluck"
    },
    "created_at": "2018-08-08T08:21:44.001"
  }
]
```

### getTransactionsDetailOfPublicKeys(publickeys, [skip], [take = 10]) => Promise

Get detail information about transactions about provided `public keys`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `publickeys`: The public keys you want to query about, can be an array or a single value (Required)
- `skip`: The count to skip before taking data from the list, for paging. Optional.
- `take`: The count to take, for paging. Optional.

#### Response

The response is an array consisting of the detail information of the transactions you queried.

A example:

```json
[{
    "id": "0925740e3be034e4ac345461d6f5b95162a7cf1578a7ec3c7b9de0e9f0f84e3c",
    "signatures": [
      "SIG_K1_K1G7PJcRaTgw8RBDVvHsj2SEPZTcV5S8KgdrSmpD1oUd6fgVdwD3jSqL7zSkaFAV2zDPsr4pYTK1QkusALsEDGXk4PUC8y"
    ],
    "compression": "none",
    "packed_trx": "9073345baf0105f3a965000100802bebd152e74c000000000000000000000000009f077d000000000000000000000000819e470164000000000000000000000000009f077d030000000000000000000000000000307c0000000000000000000000000000407c0000000000000000000000000000507c010003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a97000",
    "transaction": {
      "expiration": "2018-06-28T05:35:12",
      "ref_block_num": 431,
      "ref_block_prefix": 1705636613,
      "actions": [{
          "name": "issuetoken",
          "domain": "test",
          "key": ".issue",
          "data": {
            "domain": "test",
            "names": [
              "t1",
              "t2",
              "t3"
            ],
            "owner": [
              "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX"
            ]
          },
          "hex_data": "000000000000000000000000009f077d030000000000000000000000000000307c0000000000000000000000000000407c0000000000000000000000000000507c010003c7e3ff0060d848bd31bf53daf1d5fed7d82c9b1121394ee15dcafb07e913a970"
        }
      ],
      "transaction_extensions": []
    }
}]
```

### getFungibleSymbolDetail(sym_id) => Promise

Get detail information about a fungible token symbol which has provided `sym_id`.

> Make sure you have history_plugin enabled on connected node

#### Parameters

- `sym_id`: The symbol id to query about, only the id (number), precision should not be included (required)

#### Response

The response is a abject containing the detail information of the symbols you queried.

A example:

```json
{
  "sym": "5,S#1",
  "sym_name": "EVT",
  "name": "EVT",
  "creator": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
  "create_time": "2018-06-28T05:31:09",
  "issue": {
    "name": "issue",
    "threshold": 1,
    "authorizers": [{
        "ref": "[A] EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
        "weight": 1
      }
    ]
  },
  "manage": {
    "name": "manage",
    "threshold": 1,
    "authorizers": [{
        "ref": "[A] EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
        "weight": 1
      }
    ]
  },
  "total_supply": "100000.00000 S#1",
  "current_supply": "0.00000 S#1",
  "metas": []
}
```

### getRequiredKeysForSuspendedTransaction(proposalName, availableKeys) => Promise

This API is used for getting required keys for suspend transaction. Other than non-suspended transaction, this API will not throw exception when your keys don't satisfies the permission requirements for one action, instead returns the proper keys needed for authorizing the suspended transaction.

#### Parameters

- `proposalName`: The proposal name you want to sign.
- `availableKeys`: Array of public keys you own.

#### Response

The response is an array representing the list of required keys.

A example:

```json
[
    "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
]
```

### getTransactionIdForLinkId(linkId) => Promise

Get transaction id for specific `linkId`.

#### Parameters

- `linkId`: The linkId in `hexadecimal` format.

#### Response

The response is an object containing `trx_id` property which representing associated transaction id of the link id you provided.

### getSuspendedTransactionDetail(proposalName) => Promise

Get detail information for specific `proposal`.

#### Parameters

- `proposalName`: The proposal name you want to query.

#### Response

The response is an array representing the detail information of a suspended transaction, including the keys which has signed on the transaction and signed signatures.

A example:

```json
{
  "name": "suspend3",
  "proposer": "EVT546WaW3zFAxEEEkYKjDiMvg3CHRjmWX2XdNxEhi69RpdKuQRSK",
  "status": "proposed",
  "trx": {
    "expiration": "2018-07-03T07:34:14",
    "ref_block_num": 23618,
    "ref_block_prefix": 1259088709,
    "actions": [{
        "name": "newdomain",
        "domain": "test4",
        "key": ".create",
        "data": {
          "name": "test4",
          "creator": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
          "issue": {
            "name": "issue",
            "threshold": 1,
            "authorizers": [{
                "ref": "[A] EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                "weight": 1
              }
            ]
          },
          "transfer": {
            "name": "transfer",
            "threshold": 1,
            "authorizers": [{
                "ref": "[G] .OWNER",
                "weight": 1
              }
            ]
          },
          "manage": {
            "name": "manage",
            "threshold": 1,
            "authorizers": [{
                "ref": "[A] EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                "weight": 1
              }
            ]
          }
        },
        "hex_data": "000000000000000000000000189f077d0002c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cf000000008052e74c01000000010100000002c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cf000000000000000100000000b298e982a40100000001020000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000094135c6801000000010100000002c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cf000000000000000100"
      }
    ],
    "transaction_extensions": []
  },
  "signed_keys": [
    "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
  ],
  "signatures": [
    "SIG_K1_K1x3vANVU1H9zxKutyRUB4kHKqMLBCaohqPwEsit9oNL8j5SUgMxxgDFA7hwCz9DkrrpaLJSndqcxy3Rmy5qfQw21qHpiJ"
  ]
}
```

### getEstimatedChargeForTransaction([config], ...action) => Promise

return estimated amount of `transaction fee` for one transaction. 

#### Parameters

The parameters are the same as `pushTransaction`. Please refer to it.

#### Response

```js
{
    `charge`: 10005
}
```

#### Example

```js
let ret = await apiCaller.getEstimatedChargeForTransaction(
    new EVT.EvtAction("issuetoken", {
        "domain": "test",
        "names": [
            "test1",
            "test2"
        ],
        "owner": [
            "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
        ]
    })
);

console.log((ret.charge * 0.00001) + " EVT");
```

#### Important
The response value should multiply by 0.00001 for the real value. For example, `10005` means `0.10005 EVT / PEVT`.

### pushTransaction([config], ...actions) => Promise

Push a `transaction` to the chain. A `transaction` is composed of some `actions`. Generally a `action` is a interface to a writable API. Almost all the writable API are wrapped in transactions.

`...` is the syntax for `Rest Parameters` in JavaScript's `ES6`. It means you could pass as many parameters as you want to the function, and JavaScript will automatically convert them into an array. So you may use `pushTransaction` like this:

```js
apiCaller.pushTransaction(
    { maxCharge: 100000 },   // config
    new EVT.EvtAction(....), // the first action
    new EVT.EvtAction(....), // the second action
    new EVT.EvtAction(....), // the third action
    new EVT.EvtAction(....), // other actions
    ....                 // as more as you want
);
```

#### Parameters

- `config`: A object consisting of some valid fields (optional):
  - `maxCharge`: For any transaction that needs transaction fee, you must provide this argument to limit the max amount of fee you may charge.
  - `payer`: Specify which user should pay for transaction fee. it's optional and will be automatically filled with the key in keyProvider (if only one key is provided in that) if you don't pass a value.
- `actions`: Each `action` is either a `EvtAction` instance or a `abi` structure. `EvtAction` is preferred.

A EvtAction can be created like this:

```js
new EVT.EvtAction(actionName, abiStructure, [domain], [key])
```

- `actionName`: Required, the name of the action you want to execute. 
- `abiStructure`: Required, the ABI structure of this action. 
- `domain` & `key`: See below.

You can find all the actions and ABI structure in everiToken [here](https://github.com/everitoken/evt/blob/master/docs/API-References.md#post-v1chaintrx_json_to_digest) and [here](https://github.com/everitoken/evt/blob/master/docs/ABI-References.md);

For each action you should provide `domain` and `key` which are two special values. Each action has its own requirement for these two values. You can see here for detail: https://github.com/everitoken/evt/blob/master/docs/API-References.md#post-v1chaintrx_json_to_digest

For these actions, you may ignore the `domain` and `key` parameter in the constructor of `EvtAction` (will be filled in automatically):
- `newdomain`
- `updatedomain`
- `newgroup`
- `updategroup`
- `issuetoken`
- `transfer`
- `destroytoken`
- `newfungible`
- `updfungible`
- `newsuspend`
- `aprvsuspend`
- `cancelsuspend`
- `execsuspend`
- `evt2pevt`
- `everipass`
- `everipay`

Here is a example to use `pushTransaction`.

```js
// this is a example about how to create a fungible token
let symbol = "ABC";

// pass EvtAction instance as a action
let newTrxId = (await apiCaller.pushTransaction(
    new EVT.EvtAction("newfungible", {
        name: symbol + ".POINTS",
        sym_name: symbol,
        sym: "5,S#233522",
        creator: publicKey,
        manage: { name: "manage", threshold: 1, authorizers: [ { ref: "[A] " + publicKey, weight: 1  } ] }, 
        issue: { name: "issue", threshold: 1, authorizers: [ { ref: "[A] " + publicKey, weight: 1  } ] }, 
        total_supply: "100000.00000 S#" + symbol
    })
)).transactionId;
```

#### Response

The response is a object containing a value named `transactionId` if succeed. Or a `Error` will be thrown.

## Action Examples

### Create Domain
```js
await apiCaller.pushTransaction(
    { maxCharge: 10000, payer: "EVTXXXXXXXXXXXXXXXXXXXXXXXXXX" },
    new EVT.EvtAction("newdomain", {
        "name": testingTmpData.newDomainName,
        "creator": publicKey,
        "issue": {
            "name": "issue",
            "threshold": 1,
            "authorizers": [{
                "ref": "[A] " + publicKey,
                "weight": 1
            }]
        },
        "transfer": {
            "name": "transfer",
            "threshold": 1,
            "authorizers": [{
                "ref": "[G] .OWNER",
                "weight": 1
            }]
        },
        "manage": {
            "name": "manage",
            "threshold": 1,
            "authorizers": [{
                "ref": "[A] " + publicKey,
                "weight": 1
            }]
        }
    })
);
```

### Issue Non-Fungible Tokens

```js
await apiCaller.pushTransaction(
    { maxCharge: 10000, payer: "EVTXXXXXXXXXXXXXXXXXXXXXXXXXX" },
    new EVT.EvtAction("issuetoken", {
        "domain": testingTmpData.newDomainName,
        "names": [
            testingTmpData.addedTokenNamePrefix + "1",
            testingTmpData.addedTokenNamePrefix + "2",
            testingTmpData.addedTokenNamePrefix + "3"
        ],
        "owner": [
            Key.privateToPublic(wif)
        ]
    })
);
```

### Create Fungible Symbol

```js
let newTrxId = (await apiCaller.pushTransaction(
    new EVT.EvtAction("newfungible", {
        name: symbol + ".POINTS",
        sym_name: symbol,
        sym: "5,S#233522",
        creator: publicKey,
        manage: { name: "manage", threshold: 1, authorizers: [ { ref: "[A] " + publicKey, weight: 1  } ] }, 
        issue: { name: "issue", threshold: 1, authorizers: [ { ref: "[A] " + publicKey, weight: 1  } ] }, 
        total_supply: "100000.00000 S#" + symbol
    })
)).transactionId;
```

### Create Group

```js
await apiCaller.pushTransaction(
    { maxCharge: 10000, payer: "EVTXXXXXXXXXXXXXXXXXXXXXXXXXX" },
    new EVT.EvtAction("newgroup", {
        "name": testingTmpData.newGroupName,
        "group": {
            "name": testingTmpData.newGroupName,
            "key": Key.privateToPublic(wif),
            "root": {
                "threshold": 6,
                "weight": 0,
                "nodes": [
                    {
                        "threshold": 1,
                        "weight": 3,
                        "nodes": [
                            {
                                "key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                                "weight": 1
                            },
                            {
                                "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                                "weight": 1
                            }
                        ]
                    },
                    {
                        "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                        "weight": 3
                    },
                    {
                        "threshold": 1,
                        "weight": 3,
                        "nodes": [
                            {
                                "key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                                "weight": 1
                            },
                            {
                                "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                                "weight": 1
                            }
                        ]
                    }
                ]
            }
        }
    })
);
```

## EvtLink

`EvtLink` is the place to generate and parse QR Codes using `EVT Link`'s syntax. `EVT Link` can be used for `everiPass`, `everiPay`, `Address Code for Recever`.

For further information, read [Documentation for EvtLink / everiPass / everiPay](TODO).

### Including

You can get the singleton of `EvtLink` class by:

```js
let evtLink = EVT.EvtLink;
```

### getUniqueLinkId() => Promise

Return a new unique `linkId` string. For `everiPay`, you must provide the same `LinkId`, unless you're sure the transaction has been processed by continuously checking for that link id's result (if network is available) or you must change link id by user's click (and show a tip saying there is a risk of double charging if he/she is using everiPay and has paid once).

### getEVTLinkQrImage(qrType, qrParams, imgParams, callback) => Number

Generate a QR Code Image for any type of `Evt Link`.

#### Parameters
- `qrType`: can be one of `everiPass`, `everiPay`, `payeeCode`.
- `qrParams`: The same as the `param` parameter of `getEvtLinkForEveriPass`, `getEvtLinkForEveriPay` and `getEvtLinkForPayeeCode`. Please refer to them.
- `imgPrams`: Has a key named `autoReload`, normally you should set it to true.
- `callback`: A function with two parameters: `error` and `response`. `response` contains `dataUrl` for image and `rawText` for the raw value of `EvtLink`.

#### Response
A object consisting of:

- `intervalId`, can be used to cancel reloading by `clearInterval`.
- `autoReloadInterval`: the timespan (ms) to reload the image automatically, currently it's fixed at 5000ms.

#### Example

Here is a full example showing how to generate a QR Code of `everiPass`.

```js
EVT.EvtLink.getEVTLinkQrImage(
    "everiPass", 
    {
        keyProvider: [ "5JgWJptxZENHR69oZsPSeVTXScRx7jYPMTjPTKAjW2JFnjEhoDZ", "5JgWJptxZENHR69oZsPSeVTXScRx7jYPMTjPTKAjW2JFnjEhoDZ" ],
        domainName: "testdomain",
        tokenName: "testtoken",
        autoDestroying: true
    },
    { 
        autoReload: true
    },
    (err, res) => {
        if (err) {
            alert(e.message);
            return;
        }
        document.getElementById("pass").setAttribute("src", res.dataUrl);
    }
);
```

### parseEvtLink(text, options) => Promise

Parse a `EvtLink` and return its information.

#### Parameters

- `text`: The text to be parsed.
- `options`:
  - `recoverPublicKeys`: boolean, if this is set to `false`, the `publicKeys` field in result will be empty array. This can make parsing faster. 

#### Response

A object with two key: `segments` for parsed list of segments, and `publicKeys` as a array of public keys who signed on the code.

For example:
```json
{
  "segments": [
    {
      "typeKey": 41,
      "value": 11
    },
    {
      "typeKey": 42,
      "value": 1532413494
    },
    {
      "typeKey": 91,
      "value": "testdomain"
    },
    {
      "typeKey": 92,
      "value": "testtoken"
    },
    {
      "typeKey": 156,
      "value": [
          220,
          178,
          159,
          254,
          169,
          136,
          34,
          185,
          65,
          18,
          98,
          248,
          71,
          246,
          18,
          102
        ]
    }
  ],
  "publicKeys": [
    "EVT8HdQYD1xfKyD7Hyu2fpBUneamLMBXmP3qsYX6HoTw7yonpjWyC",
    "EVT6MYSkiBHNDLxE6JfTmSA1FxwZCgBnBYvCo7snSQEQ2ySBtpC6s",
    "EVT7bUYEdpHiKcKT9Yi794MiwKzx5tGY3cHSh4DoCrL4B2LRjRgnt"
  ],
  "signatures": [
    "SIG_K1_KWvwzRSLgJQJbvTGEoo5TqKwSiSHJnPfKBct6H1ArfVrQsWUEuy1eK6p6cvCpsEnbZbm89ffqKNu8BbQwkyW4pL8C7s7QW",
    "SIG_K1_KfkVBKNvDKXhPksdvAMhDViooMt4fRhsSnh5Bx9VqcKoeAf8ZnKo1MPQZMV7rskgTbu36nGjh6jpRf6rLoHEvLrzGgn1ub",
    "SIG_K1_K36D1VmoWrzEqi8uQ1ysT3wagj1HcrrCUwo582hQRGV39Q7xT3J3BgigypvqJtNQjUzgmrNEaSrS81AAbe2EFeBXTvckSR"
  ]
}
```

Here is a brief reference of common used `typeKey` for convenient. For detail please refer to the document of `Evt Link`.

| typeKey | flag | description |
| --- | --- | --- |
| `41` | | (uint32) flag (available values can be used together by adding) |
|  |    1    |   protocol version 1 (required)
|   |   2    |   everiPass
|   |   4    |   everiPay
|   |   8    |   should destroy the NFT after validating the token in everiPass
|   |   16   |   address code for receiver
| `42` | | (uint32) UNIX timestamp in seconds |
| `43` | | (uint32) max allowed amount for everiPay |
| `91` | | (string) domain name to be validated in everiPass |
| `92` | | (string) token name to be validated in everiPass |
| `93` | | (string) symbol name to be paid in everiPay (for example: "5,EVT") |
| `94` | | (string) max allowed amount for payment (optional, string format remained only for amount >= 2 ^ 32) |
| `95` | | (string) public key (address) for receiving points or coins |
| `156` | | (byte string) link id(128-bit) |

### getEvtLinkForEveriPass(params) => Promise

Generate a `EvtLink` for everiPass.

> If you want to get the image of the QR Code, please use `getEVTLinkQrImage` and pass `qrParams`'s value the same as `params` in this function and set `qrType` to `everiPass`.

#### Parameters

- `params`: A object with available keys as follow (all are required):
  - `autoDestroying`: (boolean) Whether the NFT should be destroyed after use.
  - `domainName`: The domain name to be used.
  - `tokenName`: The token name to be used.

#### Response

```json
{
    "rawText": "https://evt.li/4747475658950104269227838067567628671578913008937599991051573226362789922825582-1443972880752087086281887680855802732519465663208942501663263181540543494817289428342198848085427085151498181462304538183995668650135069275689270162401724873927437039324599193368504637187075930345305371928111210517909782421005517574032138754357637265041294332862749651476330602523800565536786456308573880121527762"
}
```

### getEvtLinkForEveriPay(params) => Promise

Generate a `EvtLink` for everiPay.

> If you want to get the image of the QR Code, please use `getEVTLinkQrImage` and pass `qrParams`'s value the same as `params` in this function and set `qrType` to `everiPay`.

#### Parameters

- `params`: A object with available keys as follow:
  - `symbol`: The symbol for payment, for example: "5,EVT".
  - `maxAmount`: Max amount for charge. The real value is related with the symbol's precision. For example, EVT symbol has a precision of 5, if you set `maxAmount` to 100, the real max value will be `0.001` (Optional)
  - `linkId`: The linkId to use. It's very important to follow the rules of generating a new linkId. See `getUniqueLinkId` for detail.

#### Response

```json
{
    "rawText": "https://evt.li/4747475658950104269227838067567628671578913008937599991051573226362789922825582-1443972880752087086281887680855802732519465663208942501663263181540543494817289428342198848085427085151498181462304538183995668650135069275689270162401724873927437039324599193368504637187075930345305371928111210517909782421005517574032138754357637265041294332862749651476330602523800565536786456308573880121527762"
}
```

### getEvtLinkForPayeeCode(params) => Promise

Generate a `EvtLink` for `Payee's Qr Code` (Payee Code).

> If you want to get the image of the QR Code, please use `getEVTLinkQrImage` and pass `qrParams`'s value the same as `params` in this function and set `qrType` to `addressOfReceiver`.

#### Parameters

- `params`: A object with available keys as follow:
  - `address`: (required) The address of the receiver as a string starting with `EVT`.
  - `fungibleId`: (optional) A integer representing the id of fungible that the payee wants to receive.
  - `amount`: (optional) The amount of tokens that the payee wants to receive. If amount is provided, `fungibleId` is required.

#### Response

```json
{
    "rawText": "https://evt.li/4747475658950104269227838067567628671578913008937599991051573226362789922825582-144397288075208708628188768085580"
}
```

## Handling Errors

`evtjs` may throw two kinds of `Error`s. One is `ServerError`, another is `ClientError`. You can check if it is a `ServerError` by checking the value of `isServerError` of the error like this:

```js
try {
    // Do something about evtjs
}
catch (error) {
    if (error.isServerError) { //
        // server Error
    }
    else {
        // client Error
    }
}
```

Each server error has several properties.

- `httpCode`: The http code of server's response.
- `serverError`: The error code of everiToken public chain.
- `serverMessage`: The message of the error.
- `serverMessage`: The short message of the error.
- `rawServerError`: The original error object.

It's commended to check the error code via `serverError` property and show user-friendly message to user according to this code.

### rawServerError

`rawServerError` gives you the chance to parse the error by yourself or to get detailed information of the error.

In most cases you don't need this field as we already give you enough information in the Error.

Here is a example of `rawServerError`:

```json
{
    "code": 500,
    "message": "Internal Service Error",
    "error": {
        "code": 3100003,
        "name": "unknown_transaction_exception",
        "what": "unknown transaction",
        "details": [
            {
                "message": "Cannot find transaction",
                "file": "history_plugin.cpp",
                "line_number": 248,
                "method": "get_block_id_by_trx_id"
            }
        ]
    }
}
```
