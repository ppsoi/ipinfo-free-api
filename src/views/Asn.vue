<template>
  <div class="container asn is-fullhd">

    <!-- <div class="notification is-primary">
      This container is <strong>centered</strong> on desktop and larger viewports.
    </div> -->
    <div class="ip-lookup">
      <section class="section my-ip-lookup">
        <div class="container">
          <h1 class="title">ASN Lookup</h1>
          <div class="field">
            <div class="control">
              <input class="input" v-model="ipAddress" type="text" placeholder="Enter ASN"
                @keyup.enter="lookupIpAddress" />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="lookupIpAddress">Lookup</button>
            </div>
          </div>

          <!-- <div class="result"> -->
          <div class="table-container">
            <h2 class="subtitle">ASN INFO</h2>

            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" v-if="ipInfo">
              <tbody>
                <tr v-for="(value, key) in ipInfo" :key="key">
                  <th style="  text-transform: capitalize;">{{ key }}</th>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </table>
            <h2 class="subtitle">IPv4</h2>

            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" v-if="cidrv4">
              <thead>
                <tr>
                  <th>Netblock</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Domain</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prefix, index) in cidrv4" :key="index">
                  <td>{{ prefix.netblock }}</td>
                  <td>{{ prefix.id }}</td>
                  <td>{{ prefix.name }}</td>
                  <td>{{ prefix.country }}</td>
                  <td>{{ prefix.size }}</td>
                  <td>{{ prefix.status }}</td>
                  <td>{{ prefix.domain }}</td>
                </tr>
              </tbody>
            </table>
            <h2 class="subtitle">IPv6</h2>

            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" v-if="cidrv6">
              <thead>
                <tr>
                  <th>Netblock</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Domain</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prefix, index) in cidrv6" :key="index">
                  <td>{{ prefix.netblock }}</td>
                  <td>{{ prefix.id }}</td>
                  <td>{{ prefix.name }}</td>
                  <td>{{ prefix.country }}</td>
                  <td>{{ prefix.size }}</td>
                  <td>{{ prefix.status }}</td>
                  <td>{{ prefix.domain }}</td>
                </tr>
              </tbody>
            </table>
            <h2 class="subtitle">Peers</h2>

            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" v-if="peerinfo">
              <tbody>
                <tr v-for="(value, key) in peerinfo" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </table>
            <!-- <table v-if="ipInfo">
              <tr v-for="(value, key) in ipInfo" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </table> -->
          </div>
        </div>
        <!-- </div> -->
      </section>
      <footer class="footer">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
            is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.my-ip-lookup {
  padding: 20px;
}

.asn {
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      ipAddress: this.getASNAddressFromCookie() || '', // Use the stored ASN from the cookie
      ipInfo: null,
      // cidrs: null,
      cidrv4: null,
      cidrv6: null,
      peerinfo: null,
    };
  },
  created() {
    const url = new URL(window.location.href);
    if (url.searchParams.has("asn")) {
      this.ipAddress = url.searchParams.get("asn");
      this.hostname = window.location.hostname;
    }
    this.lookupIpAddress();
  },

  methods: {
    async lookupIpAddress() {
      try {
        // 处理输入的 ASN
        if (this.ipAddress.toLowerCase().startsWith('as')) {
          this.ipAddress = this.ipAddress.substring(2);
        }
        // const url = `https://${this.hostname}/api/${this.ipAddress}`;
        const url = `https://ip.3k.free.hr/api/AS${this.ipAddress}`;
        const response = await axios.get(url);
        this.ipInfo = response.data;
        // 构建剩余字段的新对象
        this.ipInfo = {
          asn: this.ipInfo.asn,
          name: this.ipInfo.name,
          country: this.ipInfo.country,
          allocated: this.ipInfo.allocated,
          registry: this.ipInfo.registry,
          domain: this.ipInfo.domain,
          num_ips: this.ipInfo.num_ips,
          type: this.ipInfo.type,
        };
        this.peerinfo = {
          peers: response.data.peers,
          upstreams: response.data.upstreams,
          downstreams: response.data.downstreams,
        };
        this.cidrv4 = response.data.prefixes;
        this.cidrv6 = response.data.prefixes6;
        // this.cidrs = {
        //   ipv4: this.ipv4,
        //   ipv6: this.ipv6,
        // }
        // Save the entered ASN to the cookie
        this.saveASNAddressToCookie(this.ipAddress);
      } catch (error) {
        console.error('Error fetching IP info:', error);
        this.ipInfo = null;
      }
    },
    saveASNAddressToCookie(ipAddress) {
      const now = new Date();
      now.setFullYear(now.getFullYear() + 1); // Set the cookie expiration to 1 year from now
      document.cookie = `ASNAddress=${ipAddress}; expires=${now.toUTCString()}; path=/`;
    },
    getASNAddressFromCookie() {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('ASNAddress='));
      if (cookie) {
        return cookie.split('=')[1];
      }
      return null;
    },
  },
};
</script>
