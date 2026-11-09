import { AsYouType, getExampleNumber, type CountryCode } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'

export function formatNationalPhone(country: string, value: string) {
  return new AsYouType(country as CountryCode).input(value.replace(/\D/g, ''))
}

export function nationalPhonePlaceholder(country: string) {
  return getExampleNumber(country as CountryCode, examples)?.formatNational() || 'Phone number'
}

export function toE164Phone(country: string, value: string, fallbackDialCode: string) {
  const typer = new AsYouType(country as CountryCode)
  typer.input(value.replace(/\D/g, ''))
  return typer.getNumber()?.number || `${fallbackDialCode.replace(/\s/g, '')}${value.replace(/\D/g, '')}`
}

export function isValidNationalPhone(country: string, value: string) {
  const typer = new AsYouType(country as CountryCode)
  typer.input(value.replace(/\D/g, ''))
  return typer.getNumber()?.isValid() === true
}
