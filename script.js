$(document).ready(function() {
    const BASE_URL = 'https://chiejuwonsfx.github.io/api-wilayah-indonesia/json';
    let provinsiData = {};

    const populateSelect = (selectElem, items, placeholder) => {
        let options = `<option value="">${placeholder}</option>`;
        
        $.each(items, function(index, item) {
            options += `<option value="${item.id}">${item.nama}</option>`;
        });
        
        selectElem.html(options).prop('disabled', false);
    };

    $.getJSON(`${BASE_URL}/provinces.json`, function(data) {
        populateSelect($('#provinsi'), data, 'Pilih Provinsi');
    }).fail(function() {
        alert('Gagal memuat data provinsi. Pastikan Anda terhubung ke internet.');
    });

    $('#provinsi').on('change', function() {
        const provId = $(this).val();
        if (!provId) {
            $('#kabupaten').html('<option value="">Pilih Kabupaten</option>').prop('disabled', true);
            $('#kecamatan').html('<option value="">Pilih Kecamatan</option>').prop('disabled', true);
            $('#desa').html('<option value="">Pilih Desa</option>').prop('disabled', true);
            $('#provinsiError').show();
            return;
        } else {
            $('#provinsiError').hide();
        }

        $.getJSON(`${BASE_URL}/provinces/${provId}.json`, function(data) {
            provinsiData = data;
            populateSelect($('#kabupaten'), data.cities, 'Pilih Kabupaten/Kota');
        }).fail(function() {
            alert('Gagal memuat data kabupaten. Silakan coba lagi.');
            $('#kabupaten').html('<option value="">Gagal memuat</option>');
        });
    });

    $('#kabupaten').on('change', function() {
        const kabId = $(this).val();
        if (!kabId) {
            $('#kecamatan').html('<option value="">Pilih Kecamatan</option>').prop('disabled', true);
            $('#desa').html('<option value="">Pilih Desa</option>').prop('disabled', true);
            $('#kabupatenError').show();
            return;
        } else {
            $('#kabupatenError').hide();
        }

        const filteredDistricts = provinsiData.districts.filter(function(d) {
            return d.id_kab === kabId;
        });
        
        populateSelect($('#kecamatan'), filteredDistricts, 'Pilih Kecamatan');
    });

    $('#kecamatan').on('change', function() {
        const kecId = $(this).val();
        if (!kecId) {
            $('#desa').html('<option value="">Pilih Desa</option>').prop('disabled', true);
            $('#kecamatanError').show();
            return;
        } else {
            $('#kecamatanError').hide();
        }

        const filteredVillages = provinsiData.villages.filter(function(v) {
            return v.id_kec === kecId;
        });
        
        populateSelect($('#desa'), filteredVillages, 'Pilih Desa');
    });

    $('#desa').on('change', function() {
        if ($(this).val() === '') {
            $('#desaError').show();
        } else {
            $('#desaError').hide();
        }
    });

    $('#name').on('blur', function() {
        if ($(this).val().trim() === '') {
            $('#nameError').show();
        } else {
            $('#nameError').hide();
        }
    });

    $('#email').on('blur', function() {
        const email = $(this).val().trim();
        if (email === '') {
            $('#emailError').text('Email wajib diisi').show();
        } else if (!isValidEmail(email)) {
            $('#emailError').text('Email tidak valid').show();
        } else {
            $('#emailError').hide();
        }
    });

    $('#phone').on('blur', function() {
        const phone = $(this).val().trim();
        if (phone !== '' && !isValidPhone(phone)) {
            $('#phoneError').show();
        } else {
            $('#phoneError').hide();
        }
    });

    $('#alamat').on('blur', function() {
        if ($(this).val().trim() === '') {
            $('#alamatError').show();
        } else {
            $('#alamatError').hide();
        }
    });

    $('#subject').on('change', function() {
        if ($(this).val() === '') {
            $('#subjectError').show();
        } else {
            $('#subjectError').hide();
        }
    });

    $('#message').on('blur', function() {
        const message = $(this).val().trim();
        if (message === '') {
            $('#messageError').text('Pesan wajib diisi').show();
        } else if (message.length < 10) {
            $('#messageError').text('Pesan minimal 10 karakter').show();
        } else {
            $('#messageError').hide();
        }
    });

    $('#agree').on('change', function() {
        if (!$(this).is(':checked')) {
            $('#agreeError').show();
        } else {
            $('#agreeError').hide();
        }
    });

    $('#contactForm').submit(function(e) {
        e.preventDefault();
        let isValid = true;
        
        if ($('#name').val().trim() === '') {
            $('#nameError').show();
            isValid = false;
        }
        
        const email = $('#email').val().trim();
        if (email === '') {
            $('#emailError').text('Email wajib diisi').show();
            isValid = false;
        } else if (!isValidEmail(email)) {
            $('#emailError').text('Email tidak valid').show();
            isValid = false;
        }
        
        const phone = $('#phone').val().trim();
        if (phone !== '' && !isValidPhone(phone)) {
            $('#phoneError').show();
            isValid = false;
        }
        
        if ($('#provinsi').val() === '') {
            $('#provinsiError').show();
            isValid = false;
        }
        if ($('#kabupaten').val() === '') {
            $('#kabupatenError').show();
            isValid = false;
        }
        if ($('#kecamatan').val() === '') {
            $('#kecamatanError').show();
            isValid = false;
        }
        if ($('#desa').val() === '') {
            $('#desaError').show();
            isValid = false;
        }
        if ($('#alamat').val().trim() === '') {
            $('#alamatError').show();
            isValid = false;
        }
        
        if ($('#subject').val() === '') {
            $('#subjectError').show();
            isValid = false;
        }
        
        const message = $('#message').val().trim();
        if (message === '') {
            $('#messageError').text('Pesan wajib diisi').show();
            isValid = false;
        } else if (message.length < 10) {
            $('#messageError').text('Pesan minimal 10 karakter').show();
            isValid = false;
        }
        
        if (!$('#agree').is(':checked')) {
            $('#agreeError').show();
            isValid = false;
        }
        
        if (isValid) {
            $('#contactForm').hide();
            $('#successMessage').show();
            
            console.log("Data yang dikirim:", {
                name: $('#name').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                provinsi: $('#provinsi option:selected').text(),
                kabupaten: $('#kabupaten option:selected').text(),
                kecamatan: $('#kecamatan option:selected').text(),
                desa: $('#desa option:selected').text(),
                alamat: $('#alamat').val(),
                subject: $('#subject').val(),
                message: $('#message').val()
            });
        }
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        const re = /^[0-9]{10,}$/;
        return re.test(phone);
    }
});
