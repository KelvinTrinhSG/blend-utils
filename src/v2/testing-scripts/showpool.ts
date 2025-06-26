import {
  Backstop,
  BackstopPoolV2,
  BackstopPoolEst,
  BackstopPoolUser,
  BackstopPoolUserEst,
  Network,
  PoolV2,
  PoolEstimate,
  PoolOracle,
  PositionsEstimate,
} from '@blend-capital/blend-sdk';

const network: Network = {
  rpc: 'https://soroban-testnet.stellar.org', // rpc URL,
  passphrase: 'Test SDF Network ; September 2015', // Stellar network passphrase,
  // optional, allows you to connect to a local RPC instance
  opts: { allowHttp: true },
};

const backstop_id = 'CARAZNPKZ5P7V34KI6HTQECNROC3WSK5XNZTBYSRTRS6B3NDI2KEVIHY'; // C... the address of the backstop contract
const pool_id = 'CA62MSBK6CYMHQJGU5TBQUN36DREQDONZHGELPEIMOLTRHVWBLSNGLLV'; // C... the address of the pool contract
const user_id = 'GA6BQ6RY6C4MNY3X2LGKXYLE3XTRDLS7ZVZU4VX674LWVR2LQ45CKIUJ'; // G... the address of a user that has taken a position in the pool

// Load the pool data from the ledger to check things like supported reserves, current interest rates
// and other pool specific information like emissions.
const pool = await PoolV2.load(network, pool_id);
console.log('✅ Pool loaded:', pool);

// If price is needed, load the pool's oracle.
const pool_oracle = await pool.loadOracle();
console.log('📊 Pool Oracle:', pool_oracle);

// Additional estimates aggregate information using oracle prices. For example,
// the PoolEstimate class calculates things like total value supplied and borrowed.
const pool_est = PoolEstimate.build(pool.reserves, pool_oracle);
console.log('📈 Pool Estimate:', pool_est);

// The pool also allows you to directly load a user's position and emissions information.
const pool_user = await pool.loadUser(user_id);
console.log('👤 User position in pool:', pool_user);

// Additional estimates for their positions calculate things like borrow limit, net apr, ect.
const user_est = PositionsEstimate.build(pool, pool_oracle, pool_user.positions);
console.log('🔍 User Estimate:', user_est);

// Load the backstop data from the ledger to check things like the status of the backstop token and the
// configuration of the backstop
const backstop = await Backstop.load(network, backstop_id);
console.log('📦 Backstop Contract:', backstop);

// Load a pool's backstop data to get information like backstop size, Q4W percentage, and more.
const backstop_pool = await BackstopPoolV2.load(network, backstop_id, pool_id);
console.log('🛡️ Backstop Pool Info:', backstop_pool);

// Additional estimates calculate the total number of BLND/USDC tokens the backstop holds.
const backstop_pool_est = BackstopPoolEst.build(backstop.backstopToken, backstop_pool.poolBalance);
console.log('📊 Backstop Pool Estimate:', backstop_pool_est);

// Load a user's position in a pool's backstop
const backstop_pool_user = await BackstopPoolUser.load(network, backstop_id, pool_id, user_id);
console.log('🙋 Backstop User Position:', backstop_pool_user);

// Additional estimates calcualte total number of BLND/USDC tokens the user holds the status
// of any queued withdrawals, and the unclaimed emissions.
const backstop_pool_user_est = BackstopPoolUserEst.build(
  backstop,
  backstop_pool,
  backstop_pool_user
);
console.log('📋 Backstop User Estimate:', backstop_pool_user_est);
