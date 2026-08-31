// Service untuk kalkulasi jarak COD dan tarif ongkos kirim via Biteship API

/**
 * Hitung jarak antara dua koordinat menggunakan rumus Haversine
 * @param {number} lat1 - Latitude titik asal
 * @param {number} lon1 - Longitude titik asal
 * @param {number} lat2 - Latitude titik tujuan
 * @param {number} lon2 - Longitude titik tujuan
 * @returns {number} Jarak dalam kilometer
 */
const hitungJarakHaversine = (lat1, lon1, lat2, lon2) => {
  const radiusBumi = 6371; // km

  const derajatKeRadian = (derajat) => (derajat * Math.PI) / 180;

  const deltaLat = derajatKeRadian(lat2 - lat1);
  const deltaLon = derajatKeRadian(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(derajatKeRadian(lat1)) *
      Math.cos(derajatKeRadian(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const jarakKm = radiusBumi * c;

  return parseFloat(jarakKm.toFixed(2));
};

/**
 * Verifikasi apakah lokasi tujuan masuk dalam radius COD (maks 50 km dari gudang)
 * @param {number} destLat - Latitude tujuan pengiriman
 * @param {number} destLng - Longitude tujuan pengiriman
 * @returns {Object} { bisa_cod: boolean, jarak_km: number }
 */
const verifikasiCOD = (destLat, destLng) => {
  // Koordinat gudang dari environment variable, fallback ke Bandung
  const gudangLat = parseFloat(process.env.GUDANG_LAT) || -6.974001;
  const gudangLng = parseFloat(process.env.GUDANG_LNG) || 107.630348;

  const jarakKm = hitungJarakHaversine(gudangLat, gudangLng, destLat, destLng);
  const bisaCOD = jarakKm <= 50.0;

  return {
    bisa_cod: bisaCOD,
    jarak_km: jarakKm,
  };
};

/**
 * Dapatkan daftar tarif pengiriman dari Biteship API (dengan mock mode untuk test key)
 * @param {string} originAreaId - ID area asal pengiriman (Biteship area ID)
 * @param {string} destinationAreaId - ID area tujuan pengiriman (Biteship area ID)
 * @param {string} couriers - Daftar kurir dipisahkan koma, misal: 'jne,jnt,sicepat'
 * @param {Array} items - Array item dengan struktur { name, value, weight, quantity }
 * @returns {Array} Daftar tarif pengiriman dari berbagai kurir
 */
const hitungOngkirEkspedisi = async (originAreaId, destinationAreaId, couriers, items) => {
  const biteshipApiKey = process.env.BITESHIP_API_KEY;
  if (!biteshipApiKey) {
    throw new Error('BITESHIP_API_KEY tidak ditemukan di environment variables');
  }

  // Mock mode: gunakan data simulasi jika API key adalah test key (tidak mengurangi saldo)
  if (biteshipApiKey.startsWith('biteship_test.')) {
    const totalGram = items.reduce((total, item) => total + (item.weight * item.quantity), 0);
    let totalKg = Math.ceil(totalGram / 1000);
    if (!totalKg || isNaN(totalKg) || totalKg <= 0) totalKg = 1;

    return [
      {
        company: 'jne',
        courier_name: 'JNE',
        courier_code: 'jne',
        courier_service_name: 'REG',
        duration: '1-2 DAYS',
        price: 9000 * totalKg,
      },
      {
        company: 'jnt',
        courier_name: 'J&T',
        courier_code: 'jnt',
        courier_service_name: 'EZ',
        duration: '2-3 DAYS',
        price: 11000 * totalKg,
      },
      {
        company: 'sicepat',
        courier_name: 'SiCepat',
        courier_code: 'sicepat',
        courier_service_name: 'REG',
        duration: '1-3 DAYS',
        price: 10000 * totalKg,
      },
    ];
  }

  // Production mode: panggil Biteship API secara langsung
  const respon = await fetch('https://api.biteship.com/v1/rates/couriers', {
    method: 'POST',
    headers: {
      'Authorization': biteshipApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin_area_id: originAreaId,
      destination_area_id: destinationAreaId,
      couriers: couriers,
      items: items,
    }),
  });

  const dataRespon = await respon.json();

  if (!respon.ok) {
    throw new Error(`Biteship API error: ${dataRespon.error || dataRespon.message || 'Gagal mengambil tarif pengiriman'}`);
  }

  return dataRespon.pricing || dataRespon.data || [];
};

module.exports = {
  hitungJarakHaversine,
  verifikasiCOD,
  hitungOngkirEkspedisi,
};
