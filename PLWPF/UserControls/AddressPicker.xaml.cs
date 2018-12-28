﻿using System;
using System.Linq;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using BE.Routes;
using BL;
namespace PLWPF.UserControls
{
    /// <summary>
    /// A control to Pick an address
    /// </summary>
    public partial class AddressPicker : UserControl
    {
        private string _token;

        /// <summary>
        /// The Selected address
        /// </summary>
        public Address Address
        {
            set
            {

                TexBoxAddress.TextChanged -= TexBoxAddress_TextChanged;
                TexBoxAddress.Text = (value != null) ? value.ToString() : "";

                //search address on google
                new Thread(() =>
                {
                    try
                    {
                        GenerateNewToken();
                        var text = Routes.GetAddressSuggestionsGoogle(value.ToString(), _token).First();

                        void Action()
                        {
                            TexBoxAddress.Text = text;
                            TexBoxAddress.TextChanged += TexBoxAddress_TextChanged;
                            TexBoxAddress.BorderBrush = Brushes.LightGray;
                        }

                        Dispatcher.BeginInvoke((Action) Action);
                    }
                    catch
                    {
                        void Act()
                        {
                            TexBoxAddress.BorderBrush = Brushes.Red;
                            TexBoxAddress.TextChanged += TexBoxAddress_TextChanged;
                        }

                        Dispatcher.BeginInvoke((Action) Act);
                    }
                }).Start();

            }
            get => new Address(TexBoxAddress.Text);
        }

        //ctor
        public AddressPicker()
        {
            InitializeComponent();
            GenerateNewToken();
        }

        /// <summary>
        /// Called on address changed
        /// </summary>
        public event EventHandler TextChanged;

        /// <summary>
        /// On Text changed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void TexBoxAddress_TextChanged(object sender, TextChangedEventArgs e)
        {
            try
            {
                if (TexBoxAddress.Text != "")
                {

                    var text = TexBoxAddress.Text;
                    //get suggestions from google
                    new Thread(() =>
                    {
                        try
                        {
                            var list = Routes.GetAddressSuggestionsGoogle(text, _token);
                            //if the address is already typed
                            if (list.Any(x => x == text))
                            {
                                void Act()
                                {
                                    ListBoxSuggestions.Visibility = Visibility.Hidden;
                                }

                                Dispatcher.BeginInvoke((Action) Act);
                                return;
                            }

                            //open the suggestions list
                            void Action()
                            {
                                ListBoxSuggestions.ItemsSource = list;
                                ListBoxSuggestions.Visibility = Visibility.Visible;
                                ListBoxSuggestions.UnselectAll();
                                TexBoxAddress.BorderBrush = Brushes.LightGray;
                            }

                            Dispatcher.BeginInvoke((Action) Action);
                        }
                        catch
                        {
                            //make the border red if there is no internet or on invalid address
                            void Action()
                            {
                                TexBoxAddress.BorderBrush = Brushes.Red;
                            }

                            Dispatcher.BeginInvoke((Action) Action);
                        }
                    }).Start();

                    TextChanged?.Invoke(this, e);
                }
            }
            catch
            {
                // ignored
            }
        }

        //close suggestions on lost focus
        private void UserControl_LostFocus(object sender, RoutedEventArgs e)
        {
            ListBoxSuggestions.Visibility = Visibility.Collapsed;
        }

        //on select suggestion
        private void ListBoxSuggestions_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            //set the selected address
            if (ListBoxSuggestions.SelectedItem == null) return;
            TexBoxAddress.TextChanged -= TexBoxAddress_TextChanged;
            TexBoxAddress.Text = (string)ListBoxSuggestions.SelectedItem;
            TexBoxAddress.TextChanged += TexBoxAddress_TextChanged;
            ListBoxSuggestions.Visibility = Visibility.Collapsed;
            GenerateNewToken();
        }

        //generate token for a new session
        private void GenerateNewToken()
        {
            _token = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Replace("=", "").Replace("+", "")
                .Replace(@"\", "").Replace("/", "").Replace(".", "").Replace(":", "");
        }
    }
}
