<template>
  <div>
    <nav>
      <sui-button-group id="navi" :widths="10">
        <b-link to="/cart/myproduct">
          <sui-button>My Product  <i class="product hunt icon"></i></sui-button>
        </b-link>
        <b-link to="/cart/mycart">
          <sui-button>My Cart  <i class="shopping cart icon"></i></sui-button>
        </b-link>
        <b-link to="/cart/mypaid">
          <sui-button>My Paid  <i class="money bill alternate icon"></i></sui-button>
        </b-link>
        <b-link to="/cart/myitem">
          <sui-button>My Delivered  <i class="opencart icon"></i></sui-button>
        </b-link>
        <div>
          <sui-button v-b-modal.create-modal variant="primary">Add New Product <i class="plus circle icon"></i></sui-button>
        </div>
      </sui-button-group>
    </nav>
    <!-- modal start here -->
    <div id="for-modal">
      <b-modal id="create-modal" size="xl" hide-footer title="Add Product">
        <div id="inside">
          <form @submit.prevent="jualBarang">
            <b>gambar barang:</b>
            <b-form-file
              v-model="image"
              :state="Boolean(image)"
              placeholder="Choose a image or drop it here..."
              drop-placeholder="Drop image here..."
              required
            ></b-form-file>
            <div class="ui equal width form" style="margin-top:5px;">
              <div class="fields">
                <div class="field">
                  <label>Nama</label>
                  <input type="text" required placeholder="nama barang" v-model="namaBarang" />
                </div>
                <div class="field">
                  <label>Harga (Rupiah)</label>
                  <input type="number" required placeholder="harga barang kamu" v-model="harga" />
                </div>
              </div>
              <div class="fields">
                <div class="field">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="berapa banyak ??"
                    v-model="stock"
                  />
                </div>
                <div class="field">
                  <label>Berat (kg)</label>
                  <input type="text" required placeholder="kilogram ya.. :D" v-model="berat" />
                </div>
                <div class="field">
                  <label>Kota barang</label>
                  <input
                    type="text"
                    required
                    placeholder="barang dikirim dari mana?"
                    v-model="kota"
                  />
                </div>
              </div>
              <div class="fields">
                <div class="field">
                  <label>Deskripsi</label>
                  <textarea
                    rows="2"
                    style="height: 119px;"
                    required
                    placeholder="deskripsikan barang kamu disini..."
                    v-model="description"
                  ></textarea>
                </div>
              </div>
              <div class="field" style="display: flex; justify-content: flex-end;">
                <sui-button type="submit" secondary>Jual ini</sui-button>
              </div>
            </div>
          </form>
        </div>
      </b-modal>
    </div>
    <!-- modal end here -->
    <div id="contain">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      image: "",
      namaBarang: "",
      harga: 0,
      description: "",
      stock: 1,
      berat: "0.1",
      kota: "Jakarta"
    };
  },
  components: {},
  created() {
    this.$router.push("/cart/myproduct");
  },
  methods: {
    jualBarang() {
      const formData = new FormData();
      formData.append("image", this.image);
      formData.set("name", this.namaBarang);
      formData.set("description", this.description);
      formData.set("price", this.harga);
      formData.set("stock", this.stock);
      formData.set("weight", this.berat);
      formData.set("city", this.kota);

      this.axios({
        method: "POST",
        url: "products",
        data: formData
      })
        .then(({ data }) => {
          this.$store.dispatch("fetchMyProducts");
          this.$bvModal.hide("create-modal");
          this.$router.push("/cart/myproduct");
        })
        .catch(err => {
          this.$swal.fire(err.response.data.message)
          console.log(err.response);
        });
    }
  }
  //   watch: {
  //     $route(to, from) {
  //       console.log(from);
  //     }
  //   }
};
</script>

<style scoped>
#navi {
  width: 100vw;
  display: flex;
  justify-content: space-around;
  margin: 10px;
}
#contain {
  width: 100vw;
  display: flex;
  padding: 15px;
  overflow-y: scroll;
}
#inside {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>