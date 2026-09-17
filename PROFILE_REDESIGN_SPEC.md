# Profile & Address Management Redesign - Implementation Plan

**Date:** December 7, 2026  
**Scope:** Frontend UI/UX Revision - Profile & Address Management  
**Status:** 🚧 Planning Phase

---

## 📋 Overview

Complete redesign of Profile page to match reference images with:
- Cleaner profile information display
- Gender selection (Pria/Wanita/Lainnya)
- OTP verification UI for phone & email changes
- Separate Address Management page
- Maximum 5 addresses limit
- Empty state handling

---

## 🎯 Key Changes Required

### 1. Remove from Profile Page
- ❌ Bio section (completely removed)
- ❌ Birth date field (not in new design)
- ❌ Direct address display on profile page

### 2. Add to Profile Page
- ✅ Profile photo with "Ubah" button
- ✅ Nama (with edit modal)
- ✅ Jenis Kelamin (Pria/Wanita/Lainnya selector)
- ✅ No. Handphone (with OTP verification UI)
- ✅ Email (with OTP verification UI)
- ✅ Alamat Saya (navigation to address page)

### 3. New Separate Pages
- ✅ `/profil/alamat` - Address Management page
- ✅ `/profil/alamat/tambah` - Add Address page (or modal)

---

## 📁 Files to Create/Modify

### To Modify
1. `frontend/app/profil/page.tsx` - Complete redesign
2. `frontend/types/pengguna.types.ts` - Add gender type if needed

### To Create
1. `frontend/app/profil/alamat/page.tsx` - Address Management page
2. `frontend/app/profil/alamat/tambah/page.tsx` - Add Address page (optional)
3. `frontend/components/profil/EditNameModal.tsx` - Name edit modal
4. `frontend/components/profil/GenderSelector.tsx` - Gender selection modal
5. `frontend/components/profil/PhoneOTPModal.tsx` - Phone change with OTP
6. `frontend/components/profil/EmailOTPModal.tsx` - Email change with OTP
7. `frontend/components/profil/AddressCard.tsx` - Reusable address card

---

## 🎨 UI Components Needed

### Modals/Sheets
1. **Edit Name Modal** (bottom sheet style)
   - Title: "Ubah Nama"
   - Input field with current name
   - Clear button
   - "Simpan" button

2. **Gender Selector** (bottom sheet style)
   - Options: Pria / Perempuan / Lainnya
   - Radio button style selection
   - "Konfirmasi" button

3. **Phone OTP Modal** (full page)
   - Title: "Ganti No. Handphone"
   - Help icon (?)
   - Phone input
   - "Lanjut" button
   - OTP verification screen
   - Resend countdown

4. **Email OTP Modal** (full page)
   - Title: "Ubah Email"
   - Email input
   - "Selanjutnya" button
   - Newsletter checkbox
   - OTP verification screen
   - Resend countdown

### Profile Page Sections
1. **Header**
   - Back arrow
   - Title: "Ubah Profil"

2. **Profile Photo Section**
   - Circular photo
   - "Ubah" button below

3. **Profile Fields** (card style)
   - Nama → Opens edit modal
   - Jenis Kelamin → Opens gender selector
   - No. Handphone → Opens phone OTP
   - Email → Opens email OTP
   - Alamat Saya → Navigate to address page

### Address Management Page
1. **Header**
   - Back arrow
   - Title: "Alamat Saya"

2. **Address List** (max 5)
   - Address cards with all info
   - Edit/Delete/Set as Primary actions

3. **Empty State** (when 0 addresses)
   - Map/location icon
   - "Anda belum menambahkan alamat"
   - Subtitle text
   - "Tambah Alamat Baru" button

4. **Add Address Button**
   - Shown when < 5 addresses
   - Hidden/disabled at 5 addresses

---

## 🔄 User Flows

### Flow 1: Edit Name
```
Profile → Nama → Edit Modal → Input → Simpan → Profile (updated)
```

### Flow 2: Change Gender
```
Profile → Jenis Kelamin → Selector → Select → Konfirmasi → Profile (updated)
```

### Flow 3: Change Phone (with OTP)
```
Profile → No. Handphone → Enter New Phone → Lanjut
  → OTP Screen → Enter OTP → Verify → Success → Profile (updated)
```

### Flow 4: Change Email (with OTP)
```
Profile → Email → Enter New Email → Selanjutnya
  → OTP Screen → Enter OTP → Verify → Success → Profile (updated)
```

### Flow 5: View/Manage Addresses
```
Profile → Alamat Saya → Address List → [View all saved addresses]
```

### Flow 6: Add Address
```
Profile → Alamat Saya → Address List → Tambah Alamat Baru
  → Full Form + Map → Simpan → Address List (updated)
```

---

## 💾 State Management

### Profile State
```typescript
interface ProfileState {
  nama: string;
  email: string;
  nomor_telepon: string;
  jenis_kelamin: 'Pria' | 'Wanita' | 'Lainnya' | null;
  foto_data_url: string | null;
}
```

### Gender Type
```typescript
type JenisKelamin = 'Pria' | 'Wanita' | 'Lainnya';
```

### OTP State
```typescript
interface OTPState {
  step: 'input' | 'verify';
  value: string; // new phone or email
  otp: string;
  isVerifying: boolean;
  countdown: number; // for resend
  error: string | null;
}
```

### Address Limit
```typescript
const MAX_ADDRESSES = 5;
const canAddAddress = addressList.length < MAX_ADDRESSES;
```

---

## 🎯 Implementation Steps

### Phase 1: Profile Page Redesign ✅ PRIORITY
1. [ ] Redesign main profile page layout
2. [ ] Add gender field to dummy data
3. [ ] Remove Bio section
4. [ ] Add "Alamat Saya" navigation item
5. [ ] Simplify profile information display

### Phase 2: Edit Modals
1. [ ] Create EditNameModal component
2. [ ] Create GenderSelector component
3. [ ] Integrate modals with profile page

### Phase 3: OTP UI (Mock)
1. [ ] Create PhoneOTPModal component
   - Input screen
   - OTP verification screen
   - Countdown timer
   - Mock OTP validation
2. [ ] Create EmailOTPModal component
   - Similar to phone
   - Newsletter checkbox
   - Mock OTP validation

### Phase 4: Address Management Page
1. [ ] Create `/profil/alamat/page.tsx`
2. [ ] Display address list (reuse existing data)
3. [ ] Implement 5 address limit
4. [ ] Add empty state
5. [ ] Add "Tambah Alamat Baru" button

### Phase 5: Add Address Flow
1. [ ] Create add address page/modal
2. [ ] Reuse existing address form components
3. [ ] Integrate existing map component
4. [ ] Add validation
5. [ ] Add save functionality

### Phase 6: Polish & Testing
1. [ ] Responsive design testing
2. [ ] Mobile UX optimization
3. [ ] Error handling
4. [ ] Loading states
5. [ ] Success feedback

---

## 🚧 Technical Considerations

### Existing Components to Reuse
- ✅ `MapComponent` - Already exists
- ✅ `MapModal` - Already exists
- ✅ `AddressRegionSelector` - Already exists
- ✅ `Input` - Common component
- ✅ `Button` - Common component
- ✅ `Alert` - Common component
- ✅ `Loading` - Common component

### Dummy Data Updates
```typescript
// Add to dummyData.ts
export function saveDummyGender(gender: JenisKelamin) {
  // Save to localStorage
}

export function getDummyGender(): JenisKelamin | null {
  // Read from localStorage
}

// Existing address functions already support max 5 logic
```

### OTP Mock Implementation
```typescript
// Mock OTP verification (frontend only)
function verifyMockOTP(otp: string): boolean {
  // For demo purposes, accept any 6-digit code
  // Or accept specific code like "123456"
  return /^\d{6}$/.test(otp);
}
```

---

## 📱 Mobile-First Design

### Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Optimizations
- Bottom sheets instead of center modals
- Large touch targets (min 44px)
- Keyboard-aware layouts
- Swipe gestures where appropriate
- Fixed action buttons

---

## ⚠️ Important Notes

### What NOT to Change
- ❌ Backend code
- ❌ API endpoints
- ❌ Database schema
- ❌ Authentication logic
- ❌ Existing checkout flow
- ❌ Existing order flow

### What IS Frontend-Only
- ✅ Gender field (stored in localStorage)
- ✅ OTP UI (mock verification only)
- ✅ 5 address limit (frontend validation)
- ✅ All UI/UX improvements

### OTP Disclaimer
The OTP functionality is **UI/UX demonstration only**:
- No real SMS sending
- No real email sending
- Mock validation on frontend
- Structured for future backend integration

---

## 🎨 Visual Reference

### Profile Page Structure
```
┌─────────────────────────────────┐
│  ← Ubah Profil                  │
├─────────────────────────────────┤
│         [Photo]                 │
│          Ubah                   │
├─────────────────────────────────┤
│  Nama              Value      › │
│  Jenis Kelamin     Value      › │
│  No. Handphone     ******40   › │
│  Email             s***@**.com › │
│  Alamat Saya                  › │
└─────────────────────────────────┘
```

### Address Page Structure
```
┌─────────────────────────────────┐
│  ← Alamat Saya                  │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │ [Address Card 1]          │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ [Address Card 2]          │ │
│  └───────────────────────────┘ │
│                                 │
│  [+ Tambah Alamat Baru]         │
└─────────────────────────────────┘
```

### Empty Address State
```
┌─────────────────────────────────┐
│  ← Alamat Saya                  │
├─────────────────────────────────┤
│                                 │
│         [📍 Icon]               │
│                                 │
│  Anda belum menambahkan alamat  │
│                                 │
│  Tambahkan alamat anda untuk    │
│  memudahkan pengiriman barang   │
│                                 │
│  [Tambah Alamat Baru]           │
│                                 │
└─────────────────────────────────┘
```

---

## 🔐 Data Privacy

### Phone Number Display
```typescript
// Mask phone number: 081234567890 → ************90
function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return '*'.repeat(phone.length - 2) + phone.slice(-2);
}
```

### Email Display
```typescript
// Mask email: sahrul@icloud.com → s*************t@icloud.com
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length < 3) return email;
  return local[0] + '*'.repeat(local.length - 2) + local.slice(-1) + '@' + domain;
}
```

---

## ✅ Acceptance Criteria Checklist

### Profile Page
- [ ] Contains only: Foto, Nama, Jenis Kelamin, No. HP, Email, Alamat Saya
- [ ] Bio section completely removed
- [ ] Gender selector works (3 options)
- [ ] Name edit modal works
- [ ] Phone number masked properly
- [ ] Email masked properly

### OTP Flows
- [ ] Phone OTP UI complete (input + verify)
- [ ] Email OTP UI complete (input + verify)
- [ ] Resend countdown works
- [ ] Mock validation works
- [ ] Success feedback shown
- [ ] NO real SMS/email sent

### Address Management
- [ ] Separate address page exists
- [ ] 5 address limit enforced
- [ ] Empty state displays correctly
- [ ] Add address form complete
- [ ] Map integration works
- [ ] Save/Edit/Delete works

### General
- [ ] Mobile-first responsive
- [ ] No backend changes
- [ ] Clean code
- [ ] ESLint clean
- [ ] TypeScript clean

---

## 📝 Next Steps

Due to the complexity and size of this implementation, I recommend:

1. **Confirm Design Approach** - Review this spec with team
2. **Phase Implementation** - Implement in 6 phases as outlined
3. **Iterative Testing** - Test each phase before moving to next
4. **User Feedback** - Gather feedback on OTP UI flow
5. **Backend Planning** - Plan actual OTP integration for future

---

**Status:** 📋 Specification Complete - Ready for Implementation  
**Estimated Effort:** ~2-3 days full implementation  
**Priority:** Profile redesign → Modals → OTP UI → Address page → Polish

Would you like me to proceed with implementation starting from Phase 1?
