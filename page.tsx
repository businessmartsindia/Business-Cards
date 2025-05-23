"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { LogOut, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ProductItem = {
  id: string
  title: string
  baseRate: number
  quantity: number
  doubleSide: boolean
  additionalRate: number
  totalPrice: number
}

export default function ProductsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: "1",
      title: "Without lamination Cards",
      baseRate: 270,
      quantity: 0,
      doubleSide: false,
      additionalRate: 100,
      totalPrice: 0,
    },
    {
      id: "2",
      title: "Gloss Coated Small Cards",
      baseRate: 300,
      quantity: 0,
      doubleSide: false,
      additionalRate: 100,
      totalPrice: 0,
    },
    {
      id: "3",
      title: "Without Lamination Small Cards",
      baseRate: 250,
      quantity: 0,
      doubleSide: false,
      additionalRate: 100,
      totalPrice: 0,
    },
    {
      id: "4",
      title: "Gloss Coated Cards",
      baseRate: 330,
      quantity: 0,
      doubleSide: false,
      additionalRate: 100,
      totalPrice: 0,
    },
    {
      id: "5",
      title: "Gloss Laminated Cards",
      baseRate: 350,
      quantity: 0,
      doubleSide: false,
      additionalRate: 100,
      totalPrice: 0,
    },
    {
      id: "6",
      title: "Matt Lamination Cards",
      baseRate: 650,
      quantity: 0,
      doubleSide: false,
      additionalRate: 100,
      totalPrice: 0,
    },
    {
      id: "7",
      title: "Matt lamination UV coated Cards",
      baseRate: 1100,
      quantity: 0,
      doubleSide: false,
      additionalRate: 100,
      totalPrice: 0,
    },
  ])

  // Calculate total price for all products
  const totalOrderValue = products.reduce((sum, product) => sum + product.totalPrice, 0)

  // Update product prices when quantity or doubleSide changes
  useEffect(() => {
    const updatedProducts = products.map((product) => {
      const quantityInThousands = product.quantity / 1000
      const totalPrice =
        product.quantity > 0
          ? (product.baseRate + (product.doubleSide ? product.additionalRate : 0)) * quantityInThousands
          : 0

      return {
        ...product,
        totalPrice: Math.round(totalPrice),
      }
    })

    setProducts(updatedProducts)
  }, [products])

  // Handle quantity change
  const handleQuantityChange = (id: string, value: string) => {
    const quantity = Number.parseInt(value)
    setProducts(products.map((product) => (product.id === id ? { ...product, quantity } : product)))
  }

  // Handle double side change
  const handleDoubleSideChange = (id: string, checked: boolean) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, doubleSide: checked } : product)))
  }

  // Generate unique order ID
  const generateOrderId = () => {
    const timestamp = Date.now()
    const randomSuffix = Math.floor(Math.random() * 1000)
    return `BM${timestamp}${randomSuffix}`
  }

  // Handle order submission
  const handleOrderSubmit = (method: "email" | "whatsapp") => {
    // Check if any products are selected
    const hasOrder = products.some((product) => product.quantity > 0)

    if (!hasOrder) {
      toast({
        title: "No products selected",
        description: "Please add at least one product to your order before submitting.",
        variant: "destructive",
      })
      return
    }

    // Generate order ID
    const orderId = generateOrderId()

    // Build order details
    let orderDetails = "=== ORDER DETAILS ===\n\n"

    products.forEach((product) => {
      if (product.quantity > 0) {
        orderDetails += `PRODUCT: ${product.title}\n`
        orderDetails += `QUANTITY: ${product.quantity}\n`
        orderDetails += `DOUBLE SIDE: ${product.doubleSide ? "Yes" : "No"}\n`
        orderDetails += `PRICE: ${product.totalPrice} Rs\n\n`
      }
    })

    // Complete order summary
    orderDetails += `=== ORDER SUMMARY ===\n`
    orderDetails += `ORDER ID: ${orderId}\n`
    orderDetails += `TOTAL ORDER VALUE: ${totalOrderValue} Rs\n\n`

    // Customer information
    const customerInfo =
      `=== CUSTOMER INFORMATION ===\n\n` +
      `NAME: ${user?.fullName}\n` +
      `EMAIL: ${user?.email}\n` +
      `MOBILE: ${user?.mobile}\n\n`

    // Combine all information
    const finalMessage = `${customerInfo}${orderDetails}`

    // Show confirmation toast
    toast({
      title: "Order placed successfully!",
      description: `Your order ID is ${orderId}. Total amount: ${totalOrderValue} Rs`,
      variant: "default",
    })

    // Handle submission method
    if (method === "email") {
      const subject = `New Order from ${user?.fullName} (ID: ${orderId})`
      const mailtoLink = `mailto:info@businessmarts.site?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(finalMessage)}`
      window.open(mailtoLink, "_blank")
    } else if (method === "whatsapp") {
      const whatsappLink = `https://wa.me/9599270456?text=${encodeURIComponent(`NEW ORDER FROM BUSINESS MARTS\n\n${finalMessage}`)}`
      window.open(whatsappLink, "_blank")
    }
  }

  const LogoImage = () => {
    const [logoError, setLogoError] = useState(false)

    return (
      <img
        src={logoError ? "https://via.placeholder.com/300x100?text=Business+Marts+Logo" : "/logo.png"}
        alt="Business Marts Logo"
        className="max-h-16 md:max-h-20 filter drop-shadow-md"
        onError={() => setLogoError(true)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="header bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-center shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left bg-gradient-to-r from-white to-[#3498db] bg-clip-text text-transparent mb-2 md:mb-0">
          Business Marts
        </h1>
        <div className="flex items-center space-x-4">
          <div className="logo-container">
            <LogoImage />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-white text-white hover:bg-white hover:text-[#2c3e50]"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-2">Welcome to Business Marts!</h2>
          <p className="text-lg text-[#34495e]">
            Hello, <span className="font-semibold text-[#3498db]">{user?.fullName}</span>! Please select products below:
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl border-b-2 border-[#3498db] pb-2 inline-block">
              Offline Marketing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#3498db] border-b border-dashed border-gray-200 pb-2">
                Business Cards
              </h3>
              <p className="text-sm italic text-gray-600 mb-4">Minimum quantity: 1000 (or 0 if not needed)</p>

              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="font-medium text-[#2c3e50] md:min-w-[250px]">
                      {product.id}. {product.title}
                    </span>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
                      <span>Quantity: </span>
                      <Select
                        value={product.quantity.toString()}
                        onValueChange={(value) => handleQuantityChange(product.id, value)}
                      >
                        <SelectTrigger className="w-full md:w-[150px]">
                          <SelectValue placeholder="Select quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1000">1000</SelectItem>
                          <SelectItem value="2000">2000</SelectItem>
                          <SelectItem value="3000">3000</SelectItem>
                          <SelectItem value="4000">4000</SelectItem>
                          <SelectItem value="5000">5000</SelectItem>
                          <SelectItem value="6000">6000</SelectItem>
                          <SelectItem value="7000">7000</SelectItem>
                          <SelectItem value="8000">8000</SelectItem>
                          <SelectItem value="9000">9000</SelectItem>
                          <SelectItem value="10000">10000</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="font-semibold text-[#2c3e50] md:ml-auto">{product.totalPrice} Rs</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <Checkbox
                      id={`ds-${product.id}`}
                      checked={product.doubleSide}
                      onCheckedChange={(checked) => handleDoubleSideChange(product.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`ds-${product.id}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Double side printing (+100 Rs per 1000)
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl border-b-2 border-[#3498db] pb-2 inline-block">
              Submit Your Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please submit your order details using one of the following methods:</p>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Button
                className="w-full bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db]"
                onClick={() => handleOrderSubmit("email")}
              >
                <Mail className="mr-2 h-5 w-5" /> Email Order
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366]"
                onClick={() => handleOrderSubmit("whatsapp")}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Order
              </Button>
            </div>

            <div className="mt-6 p-3 bg-gray-50 border-l-4 border-[#3498db] text-sm text-[#2c3e50]">
              <strong>Note:</strong> Please send your design files to{" "}
              <a href="mailto:design@businessmarts.site" className="text-[#3498db] font-semibold hover:underline">
                design@businessmarts.site
              </a>{" "}
              before submitting your order. Include your name and contact information in the email.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
