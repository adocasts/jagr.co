const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('@radix-ui/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          '0': colors.violet.violet1,
          '50': colors.violet.violet2,
          '100': colors.violet.violet3,
          '200': colors.violet.violet4,
          '300': colors.violet.violet5,
          '400': colors.violet.violet6,
          '500': colors.violet.violet7,
          '600': colors.violet.violet8,
          '700': colors.violet.violet9,
          '800': colors.violet.violet10,
          '900': colors.violet.violet11,
          '950': colors.violet.violet12,
        },
        accent: {
          '0': colors.crimson.crimson1,
          '50': colors.crimson.crimson2,
          '100': colors.crimson.crimson3,
          '200': colors.crimson.crimson4,
          '300': colors.crimson.crimson5,
          '400': colors.crimson.crimson6,
          '500': colors.crimson.crimson7,
          '600': colors.crimson.crimson8,
          '700': colors.crimson.crimson9,
          '800': colors.crimson.crimson10,
          '900': colors.crimson.crimson11,
          '950': colors.crimson.crimson12,
        },
        red: {
          '0': colors.red.red1,
          '50': colors.red.red2,
          '100': colors.red.red3,
          '200': colors.red.red4,
          '300': colors.red.red5,
          '400': colors.red.red6,
          '500': colors.red.red7,
          '600': colors.red.red8,
          '700': colors.red.red9,
          '800': colors.red.red10,
          '900': colors.red.red11,
          '950': colors.red.red12,
        },
        yellow: {
          '0': colors.yellow.yellow1,
          '50': colors.yellow.yellow2,
          '100': colors.yellow.yellow3,
          '200': colors.yellow.yellow4,
          '300': colors.yellow.yellow5,
          '400': colors.yellow.yellow6,
          '500': colors.yellow.yellow7,
          '600': colors.yellow.yellow8,
          '700': colors.yellow.yellow9,
          '800': colors.yellow.yellow10,
          '900': colors.yellow.yellow11,
          '950': colors.yellow.yellow12,
        },
        green: {
          '0': colors.green.green1,
          '50': colors.green.green2,
          '100': colors.green.green3,
          '200': colors.green.green4,
          '300': colors.green.green5,
          '400': colors.green.green6,
          '500': colors.green.green7,
          '600': colors.green.green8,
          '700': colors.green.green9,
          '800': colors.green.green10,
          '900': colors.green.green11,
          '950': colors.green.green12,
        },
        blue: {
          '0': colors.blue.blue1,
          '50': colors.blue.blue2,
          '100': colors.blue.blue3,
          '200': colors.blue.blue4,
          '300': colors.blue.blue5,
          '400': colors.blue.blue6,
          '500': colors.blue.blue7,
          '600': colors.blue.blue8,
          '700': colors.blue.blue9,
          '800': colors.blue.blue10,
          '900': colors.blue.blue11,
          '950': colors.blue.blue12,
        },
        gray: {
          '0': colors.slate.slate1,
          '50': colors.slate.slate2,
          '100': colors.slate.slate3,
          '200': colors.slate.slate4,
          '300': colors.slate.slate5,
          '400': colors.slate.slate6,
          '500': colors.slate.slate7,
          '600': colors.slate.slate8,
          '700': colors.slate.slate9,
          '800': colors.slate.slate10,
          '900': colors.slate.slate11,
          '950': colors.slate.slate12,
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
        body: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
        sans: ['Venti', ...defaultTheme.fontFamily.sans],
        mono: ['Dank Mono', ...defaultTheme.fontFamily.mono]
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.950'),

            strong: {
              color: theme('colors.gray.950', defaultTheme.colors.gray[900]),
            },

            'ol > li::before': {
              color: theme('colors.gray.800', defaultTheme.colors.gray[500]),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.800', defaultTheme.colors.gray[300]),
            },

            h1: {
              color: theme('colors.gray.950', defaultTheme.colors.gray[900]),
            },
            h2: {
              color: theme('colors.gray.950', defaultTheme.colors.gray[900]),
            },
            h3: {
              color: theme('colors.gray.950', defaultTheme.colors.gray[900]),
            },
            h4: {
              color: theme('colors.gray.950', defaultTheme.colors.gray[900]),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      display: ['focus-within'],
      translate: ['group-hover']
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
