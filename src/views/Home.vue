<template>
  <div class="ip-lookup">
    <section class="section my-ip-lookup">
      <div class="container">
        <h1 class="title">IP Address Lookup</h1>
        <div class="field">
          <div class="control">
            <input class="input" v-model="ipAddress" type="text" placeholder="Enter IP Address"
              @keyup.enter="lookupIpAddress" />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-primary" @click="lookupIpAddress">Lookup</button>
          </div>
        </div>
        <div class="result">
          <pre v-if="ipInfo"><code>{{ JSON.stringify(ipInfo, null, 2) }}</code></pre>
        </div>
      </div>
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
</template>

<style scoped>
.my-ip-lookup {
  padding: 20px;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      ipAddress: this.getIpAddressFromCookie() || '', // Use the stored IP address from the cookie
      ipInfo: null,
    };
  },
  created() {
    const url = new URL(window.location.href);
    if (url.searchParams.has("ip")) {
      this.ipAddress = url.searchParams.get("ip");
    }
    this.lookupIpAddress();
  },

  methods: {
    async lookupIpAddress() {
      try {
        const response = await axios.get(`https://ipinfo-free.pages.dev/api/${this.ipAddress}`);
        this.ipInfo = response.data;

        // Save the entered IP address to the cookie
        this.saveIpAddressToCookie(this.ipAddress);
      } catch (error) {
        console.error('Error fetching IP info:', error);
        this.ipInfo = 'null';
      }
    },
    saveIpAddressToCookie(ipAddress) {
      const now = new Date();
      now.setFullYear(now.getFullYear() + 1); // Set the cookie expiration to 1 year from now
      document.cookie = `ipAddress=${ipAddress}; expires=${now.toUTCString()}; path=/`;
    },
    getIpAddressFromCookie() {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('ipAddress='));
      if (cookie) {
        return cookie.split('=')[1];
      }
      return null;
    },
  },
};
</script>
