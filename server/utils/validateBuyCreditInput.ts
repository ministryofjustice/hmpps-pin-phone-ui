import ERROR_MESSAGE from '../constants/errorMessages'
import { stringToPence, toPounds } from './utils'

type ValidationError = {
  href: string
  text: string
}

type ValidationResult = {
  errorList: ValidationError[]
  amountError?: {
    text: string
  }
}

const validateBuyCreditInput = (
  requestedCreditAmountPounds: string,
  currentPinPhoneCreditPence: number,
  currentSpendsBalancePence: number,
  pinPhoneCreditLimitPence: number,
  creditBuyCapacityPence: number,
): ValidationResult => {
  if (creditBuyCapacityPence === 0) {
    return {
      errorList: [
        {
          href: '#amount',
          text: ERROR_MESSAGE.CANNOT_PURCHASED_ADDITIONAL_CREDIT.replace(
            '{limit}',
            Number(toPounds(pinPhoneCreditLimitPence)).toString(),
          ),
        },
      ],
      amountError: {
        text: ERROR_MESSAGE.CANNOT_PURCHASED_ADDITIONAL_CREDIT.replace(
          '{limit}',
          Number(toPounds(pinPhoneCreditLimitPence)).toString(),
        ),
      },
    }
  }
  // No radio button selected
  if (!requestedCreditAmountPounds) {
    return {
      errorList: [
        {
          href: '#amount',
          text: ERROR_MESSAGE.RADIO_OPTION_NOT_SELECTED_ERROR,
        },
      ],
      amountError: {
        text: ERROR_MESSAGE.RADIO_OPTION_NOT_SELECTED_ERROR,
      },
    }
  }

  // Other selected, but the amount is not numeric or decimal place is more than 2
  if (Number.isNaN(requestedCreditAmountPounds) || !/^\d+(\.\d{1,2})?$/.test(requestedCreditAmountPounds)) {
    return {
      errorList: [
        {
          href: '#amount',
          text: ERROR_MESSAGE.INVALID_AMOUNT_ERROR,
        },
      ],
      amountError: {
        text: ERROR_MESSAGE.INVALID_AMOUNT_ERROR,
      },
    }
  }

  // the selected amount is greater than spendBalance
  if (stringToPence(requestedCreditAmountPounds) > currentSpendsBalancePence) {
    return {
      errorList: [
        {
          href: '#amount',
          text: ERROR_MESSAGE.NOT_ENOUGH_SPEND_BALANCE_ERROR,
        },
      ],
      amountError: {
        text: ERROR_MESSAGE.NOT_ENOUGH_SPEND_BALANCE_ERROR,
      },
    }
  }

  // the amount is greater than allowed pinPhoneCreditLimit
  if (currentPinPhoneCreditPence + stringToPence(requestedCreditAmountPounds) > pinPhoneCreditLimitPence) {
    return {
      errorList: [
        {
          href: '#amount',
          text: ERROR_MESSAGE.CREDIT_LIMIT_EXCEEDED_ERROR.replace(
            '{limit}',
            Number(toPounds(pinPhoneCreditLimitPence)).toString(),
          ),
        },
      ],
      amountError: {
        text: ERROR_MESSAGE.CREDIT_LIMIT_EXCEEDED_ERROR.replace(
          '{limit}',
          Number(toPounds(pinPhoneCreditLimitPence)).toString(),
        ),
      },
    }
  }

  return {
    errorList: [],
    amountError: undefined,
  }
}
export default validateBuyCreditInput
