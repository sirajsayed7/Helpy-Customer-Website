import { ArrowLeft, Check, ChevronDown, Globe2, Mail, Phone, Search, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNav } from '../context/NavContext'
import { HelpyLogo } from '../components/shared'
import { requestRegistrationOtp } from '../api/auth'
import { formatNationalPhone, isValidNationalPhone, nationalPhonePlaceholder, toE164Phone } from '../lib/phone'

type CountryCode = readonly [iso: string, name: string, dial: string]

// Complete calling-code directory. Qatar remains first for the local default;
// the remaining countries are alphabetical so the menu is easy to scan.
const COUNTRY_CODES: readonly CountryCode[] = [
  ['QA', 'Qatar', '+974'],
  ['AF', 'Afghanistan', '+93'], ['AL', 'Albania', '+355'], ['DZ', 'Algeria', '+213'], ['AD', 'Andorra', '+376'], ['AO', 'Angola', '+244'], ['AG', 'Antigua and Barbuda', '+1 268'], ['AR', 'Argentina', '+54'], ['AM', 'Armenia', '+374'], ['AU', 'Australia', '+61'], ['AT', 'Austria', '+43'], ['AZ', 'Azerbaijan', '+994'],
  ['BS', 'Bahamas', '+1 242'], ['BH', 'Bahrain', '+973'], ['BD', 'Bangladesh', '+880'], ['BB', 'Barbados', '+1 246'], ['BY', 'Belarus', '+375'], ['BE', 'Belgium', '+32'], ['BZ', 'Belize', '+501'], ['BJ', 'Benin', '+229'], ['BT', 'Bhutan', '+975'], ['BO', 'Bolivia', '+591'], ['BA', 'Bosnia and Herzegovina', '+387'], ['BW', 'Botswana', '+267'], ['BR', 'Brazil', '+55'], ['BN', 'Brunei', '+673'], ['BG', 'Bulgaria', '+359'], ['BF', 'Burkina Faso', '+226'], ['BI', 'Burundi', '+257'],
  ['CV', 'Cabo Verde', '+238'], ['KH', 'Cambodia', '+855'], ['CM', 'Cameroon', '+237'], ['CA', 'Canada', '+1'], ['CF', 'Central African Republic', '+236'], ['TD', 'Chad', '+235'], ['CL', 'Chile', '+56'], ['CN', 'China', '+86'], ['CO', 'Colombia', '+57'], ['KM', 'Comoros', '+269'], ['CG', 'Congo', '+242'], ['CD', 'Congo, Democratic Republic', '+243'], ['CR', 'Costa Rica', '+506'], ['CI', "Côte d’Ivoire", '+225'], ['HR', 'Croatia', '+385'], ['CU', 'Cuba', '+53'], ['CY', 'Cyprus', '+357'], ['CZ', 'Czechia', '+420'],
  ['DK', 'Denmark', '+45'], ['DJ', 'Djibouti', '+253'], ['DM', 'Dominica', '+1 767'], ['DO', 'Dominican Republic', '+1 809'],
  ['EC', 'Ecuador', '+593'], ['EG', 'Egypt', '+20'], ['SV', 'El Salvador', '+503'], ['GQ', 'Equatorial Guinea', '+240'], ['ER', 'Eritrea', '+291'], ['EE', 'Estonia', '+372'], ['SZ', 'Eswatini', '+268'], ['ET', 'Ethiopia', '+251'],
  ['FJ', 'Fiji', '+679'], ['FI', 'Finland', '+358'], ['FR', 'France', '+33'],
  ['GA', 'Gabon', '+241'], ['GM', 'Gambia', '+220'], ['GE', 'Georgia', '+995'], ['DE', 'Germany', '+49'], ['GH', 'Ghana', '+233'], ['GR', 'Greece', '+30'], ['GD', 'Grenada', '+1 473'], ['GT', 'Guatemala', '+502'], ['GN', 'Guinea', '+224'], ['GW', 'Guinea-Bissau', '+245'], ['GY', 'Guyana', '+592'],
  ['HT', 'Haiti', '+509'], ['HN', 'Honduras', '+504'], ['HU', 'Hungary', '+36'],
  ['IS', 'Iceland', '+354'], ['IN', 'India', '+91'], ['ID', 'Indonesia', '+62'], ['IR', 'Iran', '+98'], ['IQ', 'Iraq', '+964'], ['IE', 'Ireland', '+353'], ['IL', 'Israel', '+972'], ['IT', 'Italy', '+39'],
  ['JM', 'Jamaica', '+1 876'], ['JP', 'Japan', '+81'], ['JO', 'Jordan', '+962'],
  ['KZ', 'Kazakhstan', '+7'], ['KE', 'Kenya', '+254'], ['KI', 'Kiribati', '+686'], ['KP', 'Korea, North', '+850'], ['KR', 'Korea, South', '+82'], ['KW', 'Kuwait', '+965'], ['KG', 'Kyrgyzstan', '+996'],
  ['LA', 'Laos', '+856'], ['LV', 'Latvia', '+371'], ['LB', 'Lebanon', '+961'], ['LS', 'Lesotho', '+266'], ['LR', 'Liberia', '+231'], ['LY', 'Libya', '+218'], ['LI', 'Liechtenstein', '+423'], ['LT', 'Lithuania', '+370'], ['LU', 'Luxembourg', '+352'],
  ['MG', 'Madagascar', '+261'], ['MW', 'Malawi', '+265'], ['MY', 'Malaysia', '+60'], ['MV', 'Maldives', '+960'], ['ML', 'Mali', '+223'], ['MT', 'Malta', '+356'], ['MH', 'Marshall Islands', '+692'], ['MR', 'Mauritania', '+222'], ['MU', 'Mauritius', '+230'], ['MX', 'Mexico', '+52'], ['FM', 'Micronesia', '+691'], ['MD', 'Moldova', '+373'], ['MC', 'Monaco', '+377'], ['MN', 'Mongolia', '+976'], ['ME', 'Montenegro', '+382'], ['MA', 'Morocco', '+212'], ['MZ', 'Mozambique', '+258'], ['MM', 'Myanmar', '+95'],
  ['NA', 'Namibia', '+264'], ['NR', 'Nauru', '+674'], ['NP', 'Nepal', '+977'], ['NL', 'Netherlands', '+31'], ['NZ', 'New Zealand', '+64'], ['NI', 'Nicaragua', '+505'], ['NE', 'Niger', '+227'], ['NG', 'Nigeria', '+234'], ['MK', 'North Macedonia', '+389'], ['NO', 'Norway', '+47'],
  ['OM', 'Oman', '+968'],
  ['PK', 'Pakistan', '+92'], ['PW', 'Palau', '+680'], ['PS', 'Palestine', '+970'], ['PA', 'Panama', '+507'], ['PG', 'Papua New Guinea', '+675'], ['PY', 'Paraguay', '+595'], ['PE', 'Peru', '+51'], ['PH', 'Philippines', '+63'], ['PL', 'Poland', '+48'], ['PT', 'Portugal', '+351'],
  ['RO', 'Romania', '+40'], ['RU', 'Russia', '+7'], ['RW', 'Rwanda', '+250'],
  ['KN', 'Saint Kitts and Nevis', '+1 869'], ['LC', 'Saint Lucia', '+1 758'], ['VC', 'Saint Vincent and the Grenadines', '+1 784'], ['WS', 'Samoa', '+685'], ['SM', 'San Marino', '+378'], ['ST', 'Sao Tome and Principe', '+239'], ['SA', 'Saudi Arabia', '+966'], ['SN', 'Senegal', '+221'], ['RS', 'Serbia', '+381'], ['SC', 'Seychelles', '+248'], ['SL', 'Sierra Leone', '+232'], ['SG', 'Singapore', '+65'], ['SK', 'Slovakia', '+421'], ['SI', 'Slovenia', '+386'], ['SB', 'Solomon Islands', '+677'], ['SO', 'Somalia', '+252'], ['ZA', 'South Africa', '+27'], ['SS', 'South Sudan', '+211'], ['ES', 'Spain', '+34'], ['LK', 'Sri Lanka', '+94'], ['SD', 'Sudan', '+249'], ['SR', 'Suriname', '+597'], ['SE', 'Sweden', '+46'], ['CH', 'Switzerland', '+41'], ['SY', 'Syria', '+963'],
  ['TW', 'Taiwan', '+886'], ['TJ', 'Tajikistan', '+992'], ['TZ', 'Tanzania', '+255'], ['TH', 'Thailand', '+66'], ['TL', 'Timor-Leste', '+670'], ['TG', 'Togo', '+228'], ['TO', 'Tonga', '+676'], ['TT', 'Trinidad and Tobago', '+1 868'], ['TN', 'Tunisia', '+216'], ['TR', 'Türkiye', '+90'], ['TM', 'Turkmenistan', '+993'], ['TV', 'Tuvalu', '+688'],
  ['UG', 'Uganda', '+256'], ['UA', 'Ukraine', '+380'], ['AE', 'United Arab Emirates', '+971'], ['GB', 'United Kingdom', '+44'], ['US', 'United States', '+1'], ['UY', 'Uruguay', '+598'], ['UZ', 'Uzbekistan', '+998'],
  ['VU', 'Vanuatu', '+678'], ['VA', 'Vatican City', '+379'], ['VE', 'Venezuela', '+58'], ['VN', 'Vietnam', '+84'],
  ['YE', 'Yemen', '+967'],
  ['ZM', 'Zambia', '+260'], ['ZW', 'Zimbabwe', '+263'],
  // Frequently used territories, included because they have their own calling codes.
  ['AS', 'American Samoa', '+1 684'], ['AI', 'Anguilla', '+1 264'], ['AW', 'Aruba', '+297'], ['BM', 'Bermuda', '+1 441'], ['BQ', 'Bonaire, Sint Eustatius and Saba', '+599'], ['VG', 'British Virgin Islands', '+1 284'], ['KY', 'Cayman Islands', '+1 345'], ['CK', 'Cook Islands', '+682'], ['CW', 'Curaçao', '+599'], ['FK', 'Falkland Islands', '+500'], ['FO', 'Faroe Islands', '+298'], ['GF', 'French Guiana', '+594'], ['PF', 'French Polynesia', '+689'], ['GI', 'Gibraltar', '+350'], ['GL', 'Greenland', '+299'], ['GP', 'Guadeloupe', '+590'], ['GU', 'Guam', '+1 671'], ['GG', 'Guernsey', '+44'], ['HK', 'Hong Kong', '+852'], ['IM', 'Isle of Man', '+44'], ['JE', 'Jersey', '+44'], ['MO', 'Macao', '+853'], ['MQ', 'Martinique', '+596'], ['YT', 'Mayotte', '+262'], ['MS', 'Montserrat', '+1 664'], ['NC', 'New Caledonia', '+687'], ['NU', 'Niue', '+683'], ['NF', 'Norfolk Island', '+672'], ['MP', 'Northern Mariana Islands', '+1 670'], ['PR', 'Puerto Rico', '+1 787'], ['RE', 'Réunion', '+262'], ['BL', 'Saint Barthélemy', '+590'], ['MF', 'Saint Martin', '+590'], ['PM', 'Saint Pierre and Miquelon', '+508'], ['SX', 'Sint Maarten', '+1 721'], ['SH', 'Saint Helena', '+290'], ['TC', 'Turks and Caicos Islands', '+1 649'], ['VI', 'U.S. Virgin Islands', '+1 340'], ['WF', 'Wallis and Futuna', '+681'],
]

const PHONE_FORMATS: Record<string, { digits: number; placeholder: string }> = {
  QA: { digits: 8, placeholder: '55 000 000' }, AE: { digits: 9, placeholder: '50 123 4567' }, SA: { digits: 9, placeholder: '50 123 4567' }, BH: { digits: 8, placeholder: '3600 0000' }, KW: { digits: 8, placeholder: '5000 0000' }, OM: { digits: 8, placeholder: '9212 3456' }, GB: { digits: 10, placeholder: '7700 900123' }, US: { digits: 10, placeholder: '202 555 0123' }, IN: { digits: 10, placeholder: '98765 43210' },
}

export const PHONE_COUNTRIES = COUNTRY_CODES.map(([iso, name, dial]) => ({
  iso,
  name,
  dial,
  ...(PHONE_FORMATS[iso] ?? { digits: 15, placeholder: 'Phone number' }),
}))

export default function SignUpPage() {
  const { goBack, navigate } = useNav()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryIso, setCountryIso] = useState<(typeof PHONE_COUNTRIES)[number]['iso']>('QA')
  const [countryOpen, setCountryOpen] = useState(false)
  const [countryQuery, setCountryQuery] = useState('')
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selectedCountry = PHONE_COUNTRIES.find(item => item.iso === countryIso) || PHONE_COUNTRIES[0]
  const visibleCountries = PHONE_COUNTRIES.filter(country => {
    const query = countryQuery.trim().toLowerCase()
    return !query || country.name.toLowerCase().includes(query) || country.dial.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
  })

  const submit = async () => {
    const cleanFirstName = firstName.trim()
    const cleanLastName = lastName.trim()
    const country = selectedCountry
    const localPhone = phoneNumber.replace(/\D/g, '')
    const cleanPhone = toE164Phone(country.iso, localPhone, country.dial)
    const cleanEmail = email.trim().toLowerCase()
    if (cleanFirstName.length < 2) { setError('Enter your first name.'); return }
    if (cleanLastName.length < 2) { setError('Enter your last name.'); return }
    if (!isValidNationalPhone(country.iso, localPhone)) {
      setError(`Enter a valid ${country.name} phone number.`)
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) { setError('Enter a valid email address.'); return }
    if (!accepted) { setError('Please accept the terms to continue.'); return }
    setLoading(true)
    setError('')
    try {
      await requestRegistrationOtp(cleanEmail, cleanPhone)
      navigate('verify', { email: cleanEmail, firstName: cleanFirstName, lastName: cleanLastName, fullName: `${cleanFirstName} ${cleanLastName}`, phoneNumber: cleanPhone, signup: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to send the verification code.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="relative flex flex-1 flex-col overflow-hidden bg-[#edf6ff]">
    <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-[#9ed4ff]/50 blur-3xl" />
    <div className="absolute bottom-[-100px] left-[-70px] h-72 w-72 rounded-full bg-[#dce9ff] blur-3xl" />
    <div className="absolute inset-x-5 top-[76px] bottom-5 rounded-[34px] border border-white/80 bg-white/55 shadow-[0_24px_60px_rgba(35,92,166,.13)] backdrop-blur-xl" />
    <div className="relative z-10 flex flex-1 flex-col px-6 pb-6">
      <div className="flex items-center justify-between pt-5"><button onClick={goBack} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/90 text-[#173263] shadow-sm"><ArrowLeft size={21}/></button><HelpyLogo size="sm" withWord={false}/><span className="w-11" /></div>
      <div className="mt-5 px-2"><p className="text-[11px] font-black uppercase tracking-[.16em] text-[#0967ff]">Welcome to Helpy</p><h1 className="mt-2 text-[32px] font-black leading-[1.02] tracking-[-.05em] text-[#0b1637]">Create your account</h1><p className="mt-2 max-w-[310px] text-[14px] font-medium leading-6 text-[#667793]">Your account keeps your bookings, saved places and trusted providers all in one place.</p></div>
      <div className="mt-5 space-y-3 px-2">
        <div className="grid grid-cols-2 gap-3"><label className="block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">First name</span><span className="flex h-[54px] items-center gap-2 rounded-[18px] border border-[#d7e7fb] bg-white/90 px-3 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><UserRound size={18} className="shrink-0 text-[#7789a5]"/><input value={firstName} onChange={event => setFirstName(event.target.value)} autoComplete="given-name" placeholder="First" className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span></label><label className="block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">Last name</span><span className="flex h-[54px] items-center gap-2 rounded-[18px] border border-[#d7e7fb] bg-white/90 px-3 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><input value={lastName} onChange={event => setLastName(event.target.value)} autoComplete="family-name" placeholder="Last" className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span></label></div>
        <div className="relative block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">Phone number</span><span className="flex h-[54px] items-center rounded-[18px] border border-[#d7e7fb] bg-white/90 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><button type="button" onClick={() => { setCountryOpen(value => !value); setCountryQuery('') }} className="flex h-full shrink-0 items-center gap-1.5 border-r border-[#dce8f7] pl-3 pr-2.5 text-[13px] font-black text-[#334565]" aria-label="Select phone country code" aria-expanded={countryOpen}><Globe2 size={16} className="text-[#6981a4]"/><span>{selectedCountry.dial}</span><ChevronDown size={14} className={`text-[#7d8da6] transition ${countryOpen ? 'rotate-180' : ''}`}/></button><Phone size={18} className="ml-3 shrink-0 text-[#7789a5]"/><input value={formatNationalPhone(selectedCountry.iso, phoneNumber)} onChange={event => setPhoneNumber(event.target.value.replace(/\D/g, ''))} inputMode="tel" autoComplete="tel-national" aria-label="Phone number" placeholder={nationalPhonePlaceholder(selectedCountry.iso)} className="min-w-0 flex-1 bg-transparent px-2.5 text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span>{countryOpen && <><button type="button" onClick={() => setCountryOpen(false)} className="fixed inset-0 z-30 cursor-default" aria-label="Close country selector"/><div className="absolute left-0 right-0 top-[78px] z-40 max-h-[280px] overflow-y-auto rounded-[20px] border border-white/95 bg-white/95 p-2 shadow-[0_18px_45px_rgba(28,64,116,.22)] backdrop-blur-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><label className="mb-1 flex h-10 items-center gap-2 rounded-xl bg-[#f3f7fd] px-3 text-[#7789a5]"><Search size={15}/><input value={countryQuery} onChange={event => setCountryQuery(event.target.value)} autoFocus placeholder="Search country or code" className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold outline-none placeholder:font-medium"/></label>{visibleCountries.length ? visibleCountries.map(country => <button key={country.iso} type="button" onClick={() => { setCountryIso(country.iso); setPhoneNumber(''); setCountryOpen(false); setCountryQuery(''); setError('') }} className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition ${country.iso === countryIso ? 'bg-blue-50 text-[#0967ff]' : 'text-[#334565] hover:bg-[#f5f9ff]'}`}><span className="min-w-0 flex-1 truncate text-[13px] font-black">{country.name}</span><span className="text-[13px] font-black">{country.dial}</span>{country.iso === countryIso && <Check size={16} strokeWidth={3}/>}</button>) : <p className="px-3 py-5 text-center text-[13px] font-semibold text-[#7789a5]">No country found</p>}</div></>}</div>
        <label className="block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">Email address</span><span className="flex h-[54px] items-center gap-3 rounded-[18px] border border-[#d7e7fb] bg-white/90 px-4 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><Mail size={19} className="text-[#7789a5]"/><input value={email} onChange={event => setEmail(event.target.value)} onKeyDown={event => event.key === 'Enter' && submit()} type="email" autoComplete="email" placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span></label>
      </div>
      <div className="mx-2 mt-4 rounded-2xl border border-blue-100 bg-white/75 p-3.5"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0967ff]"><ShieldCheck size={19}/></span><p className="text-[12px] font-semibold leading-5 text-[#5f7190]">We’ll send a secure 6-digit code to confirm your email. No password is required.</p></div></div>
      <label className="mx-2 mt-4 flex cursor-pointer items-start gap-3 text-[12px] font-semibold leading-5 text-[#61738f]"><button type="button" onClick={() => setAccepted(value => !value)} className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${accepted ? 'border-[#0967ff] bg-[#0967ff] text-white' : 'border-[#bdcce0] bg-white text-transparent'}`} aria-label="Accept terms"><Check size={14} strokeWidth={3}/></button><span>I agree to Helpy’s <button type="button" onClick={() => navigate('terms')} className="font-black text-[#0967ff]">Terms</button> and <button type="button" onClick={() => navigate('privacy')} className="font-black text-[#0967ff]">Privacy Policy</button>.</span></label>
      {error && <p role="alert" className="mx-2 mt-3 text-[12px] font-bold text-red-500">{error}</p>}
      <button onClick={submit} disabled={loading} className="mx-2 mt-4 h-[54px] rounded-[18px] bg-gradient-to-r from-[#0967ff] to-[#005bdc] text-[15px] font-black text-white shadow-[0_15px_30px_rgba(9,103,255,.24)] disabled:cursor-wait disabled:opacity-70">{loading ? 'Sending code…' : 'Create account'}</button>
      <p className="mt-4 text-center text-[13px] font-semibold text-[#667793]">Already have an account? <button onClick={() => navigate('login')} className="font-black text-[#0967ff]">Sign in</button></p>
    </div>
  </div>
}
