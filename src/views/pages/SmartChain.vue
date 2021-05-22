<template>
  <transition name="slide-fade" appear>
    <div class="container">
       <table class="table table-sm">
        <thead>
          <tr>
            <th>Contract Address</th>
            <th>Name</th>
            <th>Balance</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="contracts && contracts.length > 0">
            <template v-for="contract in contracts">
              <tr :key="contract.address">
                <td>
                  {{ contract.address }}
                </td>
                <td>
                  {{ contract.name }}
                </td>
                <td>
                  {{ contract.balance }}
                </td>
                <td>
                  {{ contract.verified }}
                </td>
                <td>
                  <b-dropdown>
                    <b-dropdown-item :href="`https://poocoin.app/tokens/${contract.address}`" target="_blank">
                      See Poocoin Chart
                    </b-dropdown-item>
                    <b-dropdown-item :href="`https://bscscan.com/token/${contract.address}`" target="_blank">
                      View in BSC
                    </b-dropdown-item>
                    <b-dropdown-item :href="`https://exchange.pancakeswap.finance/#/swap?inputCurrency=${contract.address}`" target="_blank">
                      Buy in PancakeSwap
                    </b-dropdown-item>
                  </b-dropdown>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <v-icon
              v-if="isLoading"
              name="spinner"
              spin
              class="mr-2"
            />
          </template>
        </tbody>
      </table>
    </div>
  </transition>
</template>
<script>
import axios from 'axios';

const ADDRESS_COL_IDX = 0;
const NAME_COL_IDX = 1;
const BALANCE_COL_IDX = 4;
const VERIFIED_COL_IDX = 7;

export default {
  name: 'bsc',
  components: {
  },
  mixins: [],
  data() {
    return {
      contracts: [],
      isLoading: false
    }
  },
  mounted() {
    this.isLoading = true;
    const seconds = 20 * 1000;
    setInterval(this.loadContracts, seconds);
    this.loadContracts();
  },
  methods: {
    loadContracts() {
      const total = 20;
      Promise.all(this.generateRequests(total)).then((values) => {
        const data = this.extractData(values);
        if (data.length > 0) {
          this.contracts = data;
        }
        this.isLoading = false;
      });
    },
    generateRequests(limit) {
      const requests = [];
      for (let i = 1; i <= limit; i++) {
        requests.push(axios.get(`https://api.codetabs.com/v1/proxy/?quest=https://bscscan.com/contractsVerified/${i}?p=100`))
      }
      return requests;
    },
    extractData(values) {
      let rows = '';
      values.forEach((v) => rows = `${rows}${this.getTableRows(v?.data)}`);
      const table = document.createElement(`table`);
      table.innerHTML = rows;
      table.style.display = 'none';
      document.body.appendChild(table);

      const data = [];
      for (let i = 0, row; row = table.rows[i]; i++) {
        const balance = parseFloat(row.cells[BALANCE_COL_IDX].textContent);
        if (balance > 0) {
          const address = row.cells[ADDRESS_COL_IDX].getElementsByTagName('a')[0].textContent;
          const name = row.cells[NAME_COL_IDX].textContent;
          const verified = row.cells[VERIFIED_COL_IDX].textContent;
          data.push({ address, name, balance, verified });
        }
      }
      return data;
    },
    getTableRows(data) {
      const reg = /\<tbody[^>]*\>([^]*)\<\/tbody/m;
      const rows = data.match(reg)?.[1];
      return rows || '';
    },
    async getTotalPages() {
      const { data } = await axios.get('https://api.codetabs.com/v1/proxy/?quest=https://bscscan.com/contractsVerified/1');
      const reg = /\<body[^>]*\>([^]*)\<\/body/m;
      const body = data.match(reg)[1];
      const table = document.createElement(`div`);
      table.innerHTML = body;

      document.body.appendChild(table);
      const totalPage = document.querySelectorAll('ul.pagination li')[2].childNodes[0].querySelectorAll('strong')[1].textContent;
      return totalPage;
    },
  }
}
</script>
<style lang="scss" scoped>
  .container {
    padding: 50px;
    width: 100%;
  }
</style>
